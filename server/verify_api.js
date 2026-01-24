
const http = require('http');

const urls = [
    'http://localhost:5000/api/fixtures',
    'http://localhost:5000/api/fixtures/next-upcoming',
    'http://localhost:5000/api/patrons/top',
    'http://localhost:5000/api/articles',
    'http://localhost:5000/api/players',
    'http://localhost:5000/api/fixtures/gallery',
    'http://localhost:5000/api/leagues',
    'http://localhost:5000/api/club-league-stats'
];

urls.forEach(url => {
    http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                let count = 'N/A';
                if (Array.isArray(json.data)) {
                    count = json.data.length;
                } else if (json.data && Array.isArray(json.data.data)) {
                    count = json.data.data.length;
                } else if (Array.isArray(json)) {
                    count = json.length;
                }

                console.log(`${url}: Status ${res.statusCode}, Items: ${count}`);
                if (count === 0 || count === 'N/A') console.log('WARNING: No items found for ' + url);
            } catch (e) {
                console.log(`${url}: Status ${res.statusCode}, Error parsing JSON: ${e.message}`);
            }
        });
    }).on('error', (err) => {
        console.log(`${url}: Error - ${err.message}`);
    });
});
