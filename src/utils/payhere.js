export const PAYHERE_SDK_URL = 'https://www.payhere.lk/lib/payhere.js';

const PAYHERE_SCRIPT_ID = 'payhere-sdk';
const LOAD_TIMEOUT_MS = 15000;

function logPayHereError(stage, error) {
  console.error(`[PayHere SDK] ${stage}:`, error);
}

export function waitForPayHere(timeoutMs = LOAD_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    if (window.payhere?.startPayment) {
      resolve(window.payhere);
      return;
    }

    const deadline = Date.now() + timeoutMs;
    const interval = setInterval(() => {
      if (window.payhere?.startPayment) {
        clearInterval(interval);
        resolve(window.payhere);
        return;
      }

      if (Date.now() > deadline) {
        clearInterval(interval);
        const error = new Error(
          'PayHere SDK failed to initialize. Check ad-blockers and network tab for blocked requests to www.payhere.lk.'
        );
        logPayHereError('initialization timeout', error);
        reject(error);
      }
    }, 50);
  });
}

function injectPayHereScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = PAYHERE_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = PAYHERE_SDK_URL;
    script.async = false;

    script.onload = () => {
      waitForPayHere()
        .then(resolve)
        .catch((error) => {
          logPayHereError('script loaded but payhere global missing', error);
          reject(error);
        });
    };

    script.onerror = (event) => {
      const error = new Error(
        `Failed to load PayHere SDK from ${PAYHERE_SDK_URL}. The request may be blocked by an ad-blocker or privacy extension.`
      );
      logPayHereError('script onerror', { event, url: PAYHERE_SDK_URL });
      reject(error);
    };

    document.head.appendChild(script);
  });
}

export function loadPayHereScript() {
  if (window.payhere?.startPayment) {
    return Promise.resolve(window.payhere);
  }

  const existingScript =
    document.getElementById(PAYHERE_SCRIPT_ID) ||
    document.querySelector(`script[src="${PAYHERE_SDK_URL}"]`);

  if (existingScript) {
    return waitForPayHere();
  }

  return injectPayHereScript();
}

export function buildCustomerDetails(user) {
  const nameParts = (user?.name || 'Customer').trim().split(/\s+/).filter(Boolean);
  const first_name = nameParts[0] || 'Customer';
  const last_name = nameParts.slice(1).join(' ') || first_name;

  return {
    first_name,
    last_name,
    email: (user?.email || 'customer@example.com').trim(),
    phone: '0771234567',
    address: 'No.1, Main Street',
    city: 'Colombo',
    country: 'Sri Lanka',
  };
}
