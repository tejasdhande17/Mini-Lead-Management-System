const axios = require('axios');

/**
 * Utility to fetch random company data or enrichment data
 * Demonstration of Third Party API Integration
 */
const enrichLeadData = async () => {
    try {
        const apiUrl = process.env.ENRICHMENT_API_URL || 'https://randomuser.me/api/';
        const response = await axios.get(apiUrl);
        const user = response.data.results[0];
        return {
            location: `${user.location.city}, ${user.location.country}`,
            thumbnail: user.picture.thumbnail,
            gender: user.gender
        };
    } catch (error) {
        console.error('External API Error:', error.message);
        return null;
    }
};

module.exports = { enrichLeadData };
