
    // State management
    let currentAccessToken = localStorage.getItem('esg_access_token') || null;
    let currentUser = null;

    try {
      const storedUser = localStorage.getItem('esg_user');
      if (storedUser) currentUser = JSON.parse(storedUser);
    } catch (e) {
      currentUser = null;
    }

    // Check for OAuth callback tokens or errors in URL query params
    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token') || urlParams.get('accessToken');
      const errorFromUrl = urlParams.get('error');

      if (tokenFromUrl) {
        currentAccessToken = tokenFromUrl;
        localStorage.setItem('esg_access_token', tokenFromUrl);
        // Remove token from query parameters for security
        window.history.replaceState({}, document.title, window.location.pathname);
        showToast('OAuth Authentication successful!', 'success');
        // Fetch profile to sync user info
        callApi('/api/v1/employee/profile', 'GET', 'OAuth Profile Sync');
      } else if (errorFromUrl) {
        showToast(`OAuth Error: ${errorFromUrl}`, 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      updateUserUI();
    });

    // Auto-fill test credentials
    function fillCredentials(email, password, role) {
      document.getElementById('emailInput').value = email;
      document.getElementById('passwordInput').value = password;
      showToast(`Filled ${role} credentials`, 'info');
      
      const form = document.getElementById('loginForm');
      form.style.outline = '2px solid var(--accent-blue)';
      setTimeout(() => { form.style.outline = 'none'; }, 600);
    }

    // Handle Local Login (POST /api/v1/auth/login)
    async function handleLogin(event) {
      event.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      const password = document.getElementById('passwordInput').value;
      const submitBtn = document.getElementById('loginBtn');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Authenticating...</span>';
      hideRbacAlert();

      const startTime = performance.now();
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include' // Allow receiving httpOnly refresh cookie
        });

        const duration = Math.round(performance.now() - startTime);
        let data;
        const textResp = await response.text();
        try {
          data = JSON.parse(textResp);
        } catch {
          data = { raw: textResp };
        }

        renderConsoleOutput('POST /api/v1/auth/login', response.status, duration, data);

        if (response.ok) {
          // Token extraction (handles typical response schemas)
          currentAccessToken = data.accessToken || data.token || (data.data && data.data.accessToken) || null;
          currentUser = data.user || (data.data && data.data.user) || {
            email: email,
            role: extractRoleFromEmail(email)
          };

          if (currentAccessToken) {
            localStorage.setItem('esg_access_token', currentAccessToken);
          }
          if (currentUser) {
            localStorage.setItem('esg_user', JSON.stringify(currentUser));
          }

          updateUserUI();
          showToast(`Welcome back, ${currentUser.email || 'User'}!`, 'success');
        } else {
          showToast(data.message || 'Authentication failed', 'error');
        }
      } catch (err) {
        renderConsoleOutput('POST /api/v1/auth/login', 0, 0, {
          error: 'Network / Gateway Error',
          message: err.message,
          suggestion: 'Ensure the Express server is running on the expected port.'
        });
        showToast(`Connection failed: ${err.message}`, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🔓 Sign In with Local Credentials</span>';
      }
    }

    // Helper to infer default role if API returns partial profile
    function extractRoleFromEmail(email) {
      if (email.includes('superadmin')) return 'SuperAdmin';
      if (email.includes('manager')) return 'Manager';
      return 'Employee';
    }

    // Update session state in UI
    function updateUserUI() {
      const sessionBadge = document.getElementById('sessionStatusBadge');
      const emailDisplay = document.getElementById('displayEmail');
      const roleBadge = document.getElementById('userRoleBadge');
      const avatarInitial = document.getElementById('avatarInitial');
      const tokenPreview = document.getElementById('tokenPreview');

      if (currentAccessToken && currentUser) {
        sessionBadge.textContent = '● Authenticated';
        sessionBadge.style.color = 'var(--accent-green-bright)';
        sessionBadge.style.borderColor = 'rgba(63, 185, 80, 0.4)';

        emailDisplay.textContent = currentUser.email || 'Authenticated Principal';
        avatarInitial.textContent = (currentUser.email ? currentUser.email[0] : 'U').toUpperCase();

        const role = currentUser.role || 'Employee';
        roleBadge.textContent = role;
        roleBadge.className = `role-tag role-${role.toLowerCase()}`;

        tokenPreview.textContent = `Bearer ${currentAccessToken.substring(0, 16)}...[${currentAccessToken.length} chars]`;
      } else {
        sessionBadge.textContent = '● Unauthenticated';
        sessionBadge.style.color = 'var(--accent-yellow)';
        sessionBadge.style.borderColor = 'rgba(227, 179, 65, 0.4)';

        emailDisplay.textContent = 'No active session';
        avatarInitial.textContent = '?';
        roleBadge.textContent = 'None';
        roleBadge.className = 'role-tag';

        tokenPreview.textContent = 'Access Token: (Not Authenticated - Please Login)';
      }
    }

    // Call Protected API Endpoint
    async function callApi(endpoint, method = 'GET', label = 'API Request', bodyData = null) {
      hideRbacAlert();
      const statusBadge = document.getElementById('httpStatusBadge');
      statusBadge.textContent = 'FETCHING...';
      statusBadge.className = 'status-badge';

      const headers = {
        'Accept': 'application/json'
      };

      if (currentAccessToken) {
        headers['Authorization'] = `Bearer ${currentAccessToken}`;
      }

      if (bodyData && (method === 'POST' || method === 'PUT')) {
        headers['Content-Type'] = 'application/json';
      }

      const startTime = performance.now();
      try {
        const fetchOptions = {
          method: method,
          headers: headers,
          credentials: 'include' // Always include cookies for refresh/logout
        };

        if (bodyData) {
          fetchOptions.body = JSON.stringify(bodyData);
        }

        const response = await fetch(endpoint, fetchOptions);
        const duration = Math.round(performance.now() - startTime);

        let data;
        const rawText = await response.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { rawResponse: rawText };
        }

        renderConsoleOutput(`${method} ${endpoint}`, response.status, duration, data);

        // RBAC 403 Forbidden Detection
        if (response.status === 403) {
          showRbacAlert(endpoint, currentUser?.role || 'Unknown', data);
        } else if (response.status === 401) {
          showToast('401 Unauthorized: Valid Access Token required', 'error');
        } else if (response.ok) {
          // If profile returned user info, update current user
          if (endpoint === '/api/v1/employee/profile' && (data.user || data.employee || data.data)) {
            const profileData = data.user || data.employee || data.data;
            if (typeof profileData === 'object') {
              currentUser = { ...currentUser, ...profileData };
              localStorage.setItem('esg_user', JSON.stringify(currentUser));
              updateUserUI();
            }
          }
          showToast(`${label} succeeded (200 OK)`, 'success');
        }
      } catch (err) {
        renderConsoleOutput(`${method} ${endpoint}`, 0, 0, {
          error: 'Network / Dispatch Failure',
          details: err.message,
          suggestion: 'Server may not be running or CORS policy rejected the request.'
        });
        showToast(`Request failed: ${err.message}`, 'error');
      }
    }

    // Display RBAC Forbidden Banner
    function showRbacAlert(endpoint, currentRole, data) {
      const banner = document.getElementById('rbacAlert');
      const text = document.getElementById('rbacAlertText');
      
      const serverMessage = data.message || data.error || 'Access denied by route security guard';
      text.innerHTML = `
        <strong>Endpoint:</strong> <code>${endpoint}</code><br>
        <strong>Current Principal Role:</strong> <span class="role-tag role-${currentRole.toLowerCase()}">${currentRole}</span><br>
        <strong>Security Policy:</strong> ${serverMessage}. The Role-Based Access Control layer actively barred execution because your security clearance lacks the required privileges.
      `;
      banner.style.display = 'block';
    }

    function hideRbacAlert() {
      document.getElementById('rbacAlert').style.display = 'none';
    }

    // Logout Handler (POST /api/v1/auth/logout)
    async function logoutSession() {
      await callApi('/api/v1/auth/logout', 'POST', 'Logout & Revoke Token');
      currentAccessToken = null;
      currentUser = null;
      localStorage.removeItem('esg_access_token');
      localStorage.removeItem('esg_user');
      updateUserUI();
      showToast('Logged out successfully', 'info');
    }

    // Render formatted output in inspector console
    function renderConsoleOutput(actionLabel, status, duration, data) {
      document.getElementById('activeActionLabel').textContent = actionLabel;
      const statusBadge = document.getElementById('httpStatusBadge');
      const consoleOutput = document.getElementById('consoleOutput');

      statusBadge.textContent = status ? `${status} HTTP` : 'ERR';
      if (status >= 200 && status < 300) {
        statusBadge.className = 'status-badge status-200';
        consoleOutput.className = 'console-body';
      } else if (status === 403) {
        statusBadge.className = 'status-badge status-403';
        consoleOutput.className = 'console-body error-text';
      } else if (status === 401) {
        statusBadge.className = 'status-badge status-401';
        consoleOutput.className = 'console-body error-text';
      } else {
        statusBadge.className = 'status-badge';
        consoleOutput.className = 'console-body';
      }

      const formatted = {
        meta: {
          action: actionLabel,
          statusCode: status,
          latency: `${duration}ms`,
          timestamp: new Date().toISOString()
        },
        payload: data
      };

      consoleOutput.textContent = JSON.stringify(formatted, null, 2);
    }

    // Clear console output
    function clearConsole() {
      hideRbacAlert();
      document.getElementById('activeActionLabel').textContent = 'Ready';
      const statusBadge = document.getElementById('httpStatusBadge');
      statusBadge.textContent = 'READY';
      statusBadge.className = 'status-badge';
      document.getElementById('consoleOutput').textContent = '// Console cleared. Awaiting endpoint dispatch.';
    }

    // Toast notification helper
    let toastTimeout;
    function showToast(message, type = 'info') {
      const toast = document.getElementById('toast');
      const toastIcon = document.getElementById('toastIcon');
      const toastMessage = document.getElementById('toastMessage');

      clearTimeout(toastTimeout);

      if (type === 'success') {
        toastIcon.textContent = '✅';
        toast.style.borderColor = 'var(--accent-green-bright)';
      } else if (type === 'error') {
        toastIcon.textContent = '❌';
        toast.style.borderColor = 'var(--accent-red)';
      } else {
        toastIcon.textContent = 'ℹ️';
        toast.style.borderColor = 'var(--accent-blue)';
      }

      toastMessage.textContent = message;
      toast.classList.add('show');

      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  
