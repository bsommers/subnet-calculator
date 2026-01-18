import './style.css';
import { IPv4, IPv6 } from './subnet.js';

// DOM Elements - IPv4
const ipv4Input = document.getElementById('ipv4-ip');
const ipv4CidrInput = document.getElementById('ipv4-cidr');
const ipv4CidrSlider = document.getElementById('ipv4-cidr-slider');
const ipv4ClassSelect = document.getElementById('ipv4-class-select');
const ipv4Results = document.getElementById('ipv4-results');

// DOM Elements - IPv6
const ipv6Input = document.getElementById('ipv6-ip');
const ipv6PrefixInput = document.getElementById('ipv6-prefix');
const ipv6Results = document.getElementById('ipv6-results');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Helper to render result item
const renderResult = (label, value) => `
  <div class="result-item">
    <div class="result-label">${label}</div>
    <div class="result-value">${value}</div>
  </div>
`;

// Calculate IPv4
const updateIPv4 = () => {
    const ip = ipv4Input.value.trim();
    const cidr = parseInt(ipv4CidrInput.value);

    if (!ip) return;

    try {
        const data = IPv4.calculate(ip, cidr);
        ipv4Results.innerHTML = `
      ${renderResult('Network Address', data.networkAddress)}
      ${renderResult('Broadcast Address', data.broadcastAddress)}
      ${renderResult('Subnet Mask', data.subnetMask)}
      ${renderResult('First Usable IP', data.firstUsable)}
      ${renderResult('Last Usable IP', data.lastUsable)}
      ${renderResult('Total Hosts', data.totalHosts.toLocaleString())}
      ${renderResult('Usable Hosts', data.usableHosts.toLocaleString())}
      <div class="result-item" style="grid-column: 1 / -1;">
        <div class="result-label">Binary (IP)</div>
        <div class="result-value">${data.ipBinary}</div>
      </div>
      <div class="result-item" style="grid-column: 1 / -1;">
        <div class="result-label">Binary (Mask)</div>
        <div class="result-value">${data.maskBinary}</div>
      </div>
    `;
    } catch (e) {
        // Silent fail or show error
        console.error(e);
    }
};

// Calculate IPv6
const updateIPv6 = () => {
    const ip = ipv6Input.value.trim();
    const prefix = parseInt(ipv6PrefixInput.value);

    if (!ip) return;

    try {
        const data = IPv6.calculate(ip, prefix);
        ipv6Results.innerHTML = `
            ${renderResult('Expanded Address', data.expanded)}
            ${renderResult('Prefix Length', '/' + data.prefixLength)}
            ${renderResult('Total Addresses', data.totalAddresses)}
        `;
    } catch (e) {
        console.error(e);
    }
}

// Event Listeners - IPv4
ipv4Input.addEventListener('input', updateIPv4);
ipv4CidrInput.addEventListener('input', (e) => {
    ipv4CidrSlider.value = e.target.value;
    updateIPv4();
});
ipv4CidrSlider.addEventListener('input', (e) => {
    ipv4CidrInput.value = e.target.value;
    updateIPv4();
});
ipv4ClassSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        ipv4CidrInput.value = e.target.value;
        ipv4CidrSlider.value = e.target.value;
        updateIPv4();
    }
});

// Event Listeners - IPv6
ipv6Input.addEventListener('input', updateIPv6);
ipv6PrefixInput.addEventListener('input', updateIPv6);

// Tab Logic
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-content`).classList.add('active');
    });
});

// Initial Run
updateIPv4();
updateIPv6();
