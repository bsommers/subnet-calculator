/**
 * Subnet Calculator Logic
 */

export const IPv4 = {
    // Convert CIDR to Subnet Mask
    cidrToMask: (cidr) => {
        let mask = [];
        for (let i = 0; i < 4; i++) {
            let n = Math.min(cidr, 8);
            mask.push(256 - Math.pow(2, 8 - n));
            cidr -= n;
        }
        return mask.join('.');
    },

    // Convert IP to integer
    ipToInt: (ip) => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    },

    // Convert integer to IP
    intToIp: (int) => {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join('.');
    },

    // Calculate generic subnet info
    calculate: (ip, cidr) => {
        const ipInt = IPv4.ipToInt(ip);
        const maskInt = -1 << (32 - cidr);
        const networkInt = ipInt & maskInt;
        const broadcastInt = networkInt | (~maskInt >>> 0);
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = totalHosts - 2 > 0 ? totalHosts - 2 : 0;

        return {
            ip: ip,
            cidr: cidr,
            subnetMask: IPv4.cidrToMask(cidr),
            networkAddress: IPv4.intToIp(networkInt),
            broadcastAddress: IPv4.intToIp(broadcastInt),
            firstUsable: IPv4.intToIp(networkInt + 1),
            lastUsable: IPv4.intToIp(broadcastInt - 1),
            totalHosts: totalHosts,
            usableHosts: usableHosts,
            ipBinary: ipInt.toString(2).padStart(32, '0').match(/.{1,8}/g).join('.'),
            maskBinary: (maskInt >>> 0).toString(2).padStart(32, '0').match(/.{1,8}/g).join('.')
        };
    }
};

export const IPv6 = {
    // Expand IPv6 address to full form
    expand: (ip) => {
        // Basic expansion logic (simplified)
        // TODO: Implement robust expansion or use a library if needed, but for now we do manual
        // This is a simplified version
        let parts = ip.split(':');
        if (ip.includes('::')) {
            const doubleColonCount = ip.split('::').length - 1;
            if (doubleColonCount > 1) return "Invalid IPv6";
            const partsBefore = ip.split('::')[0].split(':').filter(x => x);
            const partsAfter = ip.split('::')[1].split(':').filter(x => x);
            const missing = 8 - (partsBefore.length + partsAfter.length);
            parts = [...partsBefore, ...Array(missing).fill('0000'), ...partsAfter];
        }
        return parts.map(p => p.padStart(4, '0')).join(':');
    },

    calculate: (ip, prefix) => {
        // Basic info
        const fullIp = IPv6.expand(ip);
        // Determine network prefix
        // This is complex for IPv6 bitwise in JS due to 128-bit integers.
        // We'll calculate the prefix string range purely for display.

        // Calculate total addresses (2^(128-prefix))
        // Since this is huge, we return a string or scientific notation
        const suffixBits = 128 - prefix;
        const totalAddresses = BigInt(2) ** BigInt(suffixBits);

        return {
            ip: ip,
            expanded: fullIp,
            prefixLength: prefix,
            totalAddresses: totalAddresses.toString()
        };
    }
};
