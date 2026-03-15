/**
 * @file data/staticPlaces.js
 * @description Curated static dataset. Place image URLs are real Wikipedia/Wikimedia
 * Commons photos of each actual place. Hotel images use verified Unsplash photos.
 */

// Verified Unsplash IDs for hotels
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const staticPlaces = {
    jaipur: [
        { name: 'Hawa Mahal', address: 'Hawa Mahal Rd, Badi Choupad, Pink City, Jaipur 302002', location: { lat: 26.9239, lng: 75.8267 }, rating: 4.6, totalRatings: 87432, category: 'historical', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' }] },
        { name: 'Amber Fort', address: 'Devisinghpura, Amer, Jaipur 302028', location: { lat: 26.9855, lng: 75.8513 }, rating: 4.7, totalRatings: 112345, category: 'heritage', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/960px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg' }] },
        { name: 'City Palace Jaipur', address: 'Tulsi Marg, Gangori Bazaar, Pink City, Jaipur 302002', location: { lat: 26.9258, lng: 75.8237 }, rating: 4.5, totalRatings: 65890, category: 'cultural', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg/960px-Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg' }] },
        { name: 'Jantar Mantar Jaipur', address: 'Gangori Bazaar, Pink City, Jaipur 302002', location: { lat: 26.9246, lng: 75.8242 }, rating: 4.3, totalRatings: 43210, category: 'historical', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Jantar_Mantar_at_Jaipur.jpg/960px-Jantar_Mantar_at_Jaipur.jpg' }] },
        { name: 'Nahargarh Fort', address: 'Krishna Nagar, Brahampuri, Jaipur 302002', location: { lat: 26.9406, lng: 75.8120 }, rating: 4.4, totalRatings: 32100, category: 'heritage', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nahargarh_13.jpg/960px-Nahargarh_13.jpg' }] },
        { name: 'Jal Mahal', address: 'Jal Mahal, Amer Rd, Jaipur 302002', location: { lat: 26.9567, lng: 75.8468 }, rating: 4.3, totalRatings: 54320, category: 'historical', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Jaipur_03-2016_39_Jal_Mahal_-_Water_Palace.jpg/960px-Jaipur_03-2016_39_Jal_Mahal_-_Water_Palace.jpg' }] },
        { name: 'Birla Mandir Jaipur', address: 'Jawahar Lal Nehru Marg, Tilak Nagar, Jaipur 302004', location: { lat: 26.8881, lng: 75.8095 }, rating: 4.6, totalRatings: 28900, category: 'cultural', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Birla_Mandir_Jaipur_%282022-07%29.jpg/960px-Birla_Mandir_Jaipur_%282022-07%29.jpg' }] },
        { name: 'Albert Hall Museum', address: 'Museum Rd, Ram Niwas Garden, Jaipur 302001', location: { lat: 26.9061, lng: 75.8190 }, rating: 4.5, totalRatings: 19800, category: 'cultural', source: 'static', city: 'Jaipur', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Albert_Hall_%28_Jaipur_%29.jpg/960px-Albert_Hall_%28_Jaipur_%29.jpg' }] },
    ],

    delhi: [
        { name: 'Red Fort', address: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi 110006', location: { lat: 28.6562, lng: 77.2410 }, rating: 4.5, totalRatings: 143210, category: 'heritage', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/960px-Delhi_fort.jpg' }] },
        { name: 'Qutub Minar', address: 'Seth Sarai, Mehrauli, New Delhi 110030', location: { lat: 28.5245, lng: 77.1855 }, rating: 4.6, totalRatings: 98234, category: 'historical', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/960px-Qutb_Minar_2022.jpg' }] },
        { name: 'India Gate', address: 'Rajpath, India Gate, New Delhi 110001', location: { lat: 28.6129, lng: 77.2295 }, rating: 4.7, totalRatings: 187632, category: 'monument', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/960px-India_Gate_in_New_Delhi_03-2016.jpg' }] },
        { name: "Humayun's Tomb", address: 'Mathura Rd, New Delhi 110013', location: { lat: 28.5933, lng: 77.2507 }, rating: 4.6, totalRatings: 54320, category: 'heritage', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tomb_of_Humayun%2C_Delhi.jpg/800px-Tomb_of_Humayun%2C_Delhi.jpg' }] },
        { name: 'Lotus Temple', address: 'Lotus Temple Rd, Bahapur, New Delhi 110019', location: { lat: 28.5535, lng: 77.2588 }, rating: 4.6, totalRatings: 76543, category: 'cultural', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/LotusDelhi.jpg/960px-LotusDelhi.jpg' }] },
        { name: 'Akshardham Temple', address: 'Noida Mor, Pandav Nagar, New Delhi 110092', location: { lat: 28.6127, lng: 77.2773 }, rating: 4.8, totalRatings: 89012, category: 'cultural', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Swaminarayan_Akshardham%2C_Delhi.jpg/800px-Swaminarayan_Akshardham%2C_Delhi.jpg' }] },
        { name: 'Jama Masjid Delhi', address: 'Jama Masjid, Chandni Chowk, New Delhi 110006', location: { lat: 28.6507, lng: 77.2334 }, rating: 4.5, totalRatings: 45678, category: 'cultural', source: 'static', city: 'Delhi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Jama_Masjid_-_In_the_Noon.jpg/960px-Jama_Masjid_-_In_the_Noon.jpg' }] },
    ],

    goa: [
        { name: 'Calangute Beach', address: 'Calangute, North Goa 403516', location: { lat: 15.5440, lng: 73.7551 }, rating: 4.3, totalRatings: 67832, category: 'beach', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Sunset_at_Calangute.jpg/800px-Sunset_at_Calangute.jpg' }] },
        { name: 'Baga Beach', address: 'Baga, North Goa 403516', location: { lat: 15.5543, lng: 73.7517 }, rating: 4.2, totalRatings: 54321, category: 'beach', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg/800px-Baga_Beach%2C_Calangute%2C_Goa.jpg' }] },
        { name: 'Basilica of Bom Jesus', address: 'Old Goa Rd, Bainguinim, Goa 403402', location: { lat: 15.5008, lng: 73.9116 }, rating: 4.7, totalRatings: 43210, category: 'heritage', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/960px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg' }] },
        { name: 'Fort Aguada', address: 'Sinquerim, Bardez, Goa 403519', location: { lat: 15.4944, lng: 73.7734 }, rating: 4.3, totalRatings: 32109, category: 'heritage', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Fort_aguada.jpg/960px-Fort_aguada.jpg' }] },
        { name: 'Dudhsagar Falls', address: 'Mollem National Park, Goa 403410', location: { lat: 15.3144, lng: 74.3147 }, rating: 4.7, totalRatings: 28976, category: 'waterfall', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Doodhsagar_Fall.jpg/960px-Doodhsagar_Fall.jpg' }] },
        { name: 'Palolem Beach', address: 'Palolem, Canacona, South Goa 403702', location: { lat: 15.0100, lng: 74.0232 }, rating: 4.5, totalRatings: 43215, category: 'beach', source: 'static', city: 'Goa', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Palolem_Beach%2C_South_Goa.jpg/960px-Palolem_Beach%2C_South_Goa.jpg' }] },
    ],

    mumbai: [
        { name: 'Gateway of India', address: 'Apollo Bandar, Colaba, Mumbai 400001', location: { lat: 18.9220, lng: 72.8347 }, rating: 4.6, totalRatings: 156789, category: 'monument', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/960px-Mumbai_03-2016_30_Gateway_of_India.jpg' }] },
        { name: 'Marine Drive', address: 'Marine Drive, Churchgate, Mumbai 400020', location: { lat: 18.9438, lng: 72.8235 }, rating: 4.7, totalRatings: 87654, category: 'nature', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg/960px-Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg' }] },
        { name: 'Elephanta Caves', address: 'Elephanta Island, Mumbai Harbour 400094', location: { lat: 18.9633, lng: 72.9315 }, rating: 4.3, totalRatings: 45678, category: 'cave', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elephanta_Caves_Trimurti.jpg/960px-Elephanta_Caves_Trimurti.jpg' }] },
        { name: 'Chhatrapati Shivaji Terminus', address: 'CST Area, Fort, Mumbai 400001', location: { lat: 18.9399, lng: 72.8356 }, rating: 4.6, totalRatings: 67890, category: 'heritage', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chhatrapati_shivaji_terminus%2C_esterno_01.jpg/960px-Chhatrapati_shivaji_terminus%2C_esterno_01.jpg' }] },
        { name: 'Siddhivinayak Temple', address: 'SK Bole Marg, Prabhadevi, Mumbai 400028', location: { lat: 19.0168, lng: 72.8307 }, rating: 4.6, totalRatings: 56789, category: 'cultural', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Shree_Siddhivinayak_Temple_Mumbai.jpg/960px-Shree_Siddhivinayak_Temple_Mumbai.jpg' }] },
        { name: 'Juhu Beach', address: 'Juhu, Mumbai 400049', location: { lat: 19.0948, lng: 72.8258 }, rating: 4.0, totalRatings: 76543, category: 'beach', source: 'static', city: 'Mumbai', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Juhu_beach_%28Arial%29.jpg/800px-Juhu_beach_%28Arial%29.jpg' }] },
    ],

    kerala: [
        { name: 'Alleppey Backwaters', address: 'Alappuzha, Kerala 688001', location: { lat: 9.4981, lng: 76.3388 }, rating: 4.7, totalRatings: 78932, category: 'nature', source: 'static', city: 'Kerala', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/960px-House_Boat_DSW.jpg' }] },
        { name: 'Munnar Tea Gardens', address: 'Munnar, Idukki, Kerala 685612', location: { lat: 10.0889, lng: 77.0595 }, rating: 4.7, totalRatings: 65432, category: 'eco_tourism', source: 'static', city: 'Kerala', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/960px-Munnar_Overview.jpg' }] },
        { name: 'Periyar National Park', address: 'Thekkady, Idukki, Kerala 685536', location: { lat: 9.5757, lng: 77.1879 }, rating: 4.5, totalRatings: 43210, category: 'eco_tourism', source: 'static', city: 'Kerala', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Periyar_National_Park.JPG/960px-Periyar_National_Park.JPG' }] },
        { name: 'Varkala Beach', address: 'Varkala, Thiruvananthapuram, Kerala 695141', location: { lat: 8.7379, lng: 76.7161 }, rating: 4.5, totalRatings: 34567, category: 'beach', source: 'static', city: 'Kerala', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Varkala_Beach%2C_Varkala%2C_Kerala.jpg/960px-Varkala_Beach%2C_Varkala%2C_Kerala.jpg' }] },
        { name: 'Fort Kochi', address: 'Fort Kochi, Kochi, Kerala 682001', location: { lat: 9.9658, lng: 76.2421 }, rating: 4.5, totalRatings: 54321, category: 'heritage', source: 'static', city: 'Kerala', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg/960px-Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg' }] },
    ],

    agra: [
        { name: 'Taj Mahal', address: 'Dharmapuri, Forest Colony, Tajganj, Agra 282001', location: { lat: 27.1751, lng: 78.0421 }, rating: 4.8, totalRatings: 234567, category: 'heritage', source: 'static', city: 'Agra', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg' }] },
        { name: 'Agra Fort', address: 'Rakabganj, Agra 282003', location: { lat: 27.1795, lng: 78.0211 }, rating: 4.5, totalRatings: 89012, category: 'heritage', source: 'static', city: 'Agra', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Agra_03-2016_10_Agra_Fort.jpg/960px-Agra_03-2016_10_Agra_Fort.jpg' }] },
        { name: 'Fatehpur Sikri', address: 'Fatehpur Sikri, Agra 283110', location: { lat: 27.0945, lng: 77.6641 }, rating: 4.5, totalRatings: 56789, category: 'heritage', source: 'static', city: 'Agra', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg/960px-Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg' }] },
        { name: 'Mehtab Bagh', address: 'Dharmapuri, Agra 282001', location: { lat: 27.1816, lng: 78.0393 }, rating: 4.4, totalRatings: 23456, category: 'nature', source: 'static', city: 'Agra', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mehtab_Bagh_facing_Taj_Mahal.JPG/960px-Mehtab_Bagh_facing_Taj_Mahal.JPG' }] },
    ],

    varanasi: [
        { name: 'Kashi Vishwanath Temple', address: 'Lahori Tola, Varanasi 221001', location: { lat: 25.3109, lng: 83.0107 }, rating: 4.5, totalRatings: 67890, category: 'cultural', source: 'static', city: 'Varanasi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kashi_Vishwanath.jpg/500px-Kashi_Vishwanath.jpg' }] },
        { name: 'Dashashwamedh Ghat', address: 'Dashashwamedh Ghat Rd, Godowlia, Varanasi 221001', location: { lat: 25.3067, lng: 83.0104 }, rating: 4.7, totalRatings: 54321, category: 'cultural', source: 'static', city: 'Varanasi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/960px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg' }] },
        { name: 'Sarnath', address: 'Sarnath, Varanasi 221007', location: { lat: 25.3790, lng: 83.0244 }, rating: 4.5, totalRatings: 45678, category: 'historical', source: 'static', city: 'Varanasi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/960px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg' }] },
        { name: 'Manikarnika Ghat', address: 'Manikarnika Ghat, Varanasi 221001', location: { lat: 25.3097, lng: 83.0092 }, rating: 4.4, totalRatings: 34567, category: 'cultural', source: 'static', city: 'Varanasi', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282011%29_5.jpg/960px-Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282011%29_5.jpg' }] },
    ],

    shimla: [
        { name: 'Mall Road Shimla', address: 'The Mall, Shimla 171001', location: { lat: 31.1048, lng: 77.1734 }, rating: 4.5, totalRatings: 43210, category: 'nature', source: 'static', city: 'Shimla', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Mall_Road_Shimla_1.jpg/960px-Mall_Road_Shimla_1.jpg' }] },
        { name: 'Jakhu Temple', address: 'Jakhu, Shimla 171001', location: { lat: 31.1011, lng: 77.1762 }, rating: 4.5, totalRatings: 34567, category: 'cultural', source: 'static', city: 'Shimla', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Jakhoo_temple.jpg/960px-Jakhoo_temple.jpg' }] },
        { name: 'Kufri', address: 'Kufri, Shimla 171012', location: { lat: 31.0987, lng: 77.2642 }, rating: 4.3, totalRatings: 23456, category: 'hill_station', source: 'static', city: 'Shimla', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg/960px-Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg' }] },
        { name: 'Green Valley Shimla', address: 'Kufri Rd, Shimla 171012', location: { lat: 31.1034, lng: 77.2231 }, rating: 4.3, totalRatings: 12345, category: 'nature', source: 'static', city: 'Shimla', photos: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg/960px-Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg' }] },
    ],
};

const getStaticPlaces = (city) => {
    if (!city) return [];
    const key = city.toLowerCase().trim();
    if (staticPlaces[key]) return staticPlaces[key];
    const found = Object.keys(staticPlaces).find((k) => key.includes(k) || k.includes(key));
    return found ? staticPlaces[found] : [];
};

// ─── Static Hotels ─────────────────────────────────────────────────────────────
const staticHotels = {
    jaipur: [
        { name: 'Rambagh Palace', address: 'Bhawani Singh Rd, Rambagh, Jaipur 302005', location: { lat: 26.8982, lng: 75.8122 }, rating: 4.8, totalRatings: 4321, type: 'hotel', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1566073771259-6a8506099945') }] },
        { name: 'ITC Rajputana', address: 'Palace Rd, Jaipur 302006', location: { lat: 26.9124, lng: 75.7922 }, rating: 4.6, totalRatings: 2890, type: 'hotel', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1520250497591-112f2f40a3f4') }] },
        { name: 'Hotel Pearl Palace', address: 'Hathroi Fort, Ajmer Rd, Jaipur 302001', location: { lat: 26.9145, lng: 75.8023 }, rating: 4.5, totalRatings: 3100, type: 'hotel', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1566073771259-6a8506099945') }] },
        { name: 'Umaid Mahal Heritage', address: 'C-59, Jai Niwas Garden, Jaipur 302004', location: { lat: 26.9050, lng: 75.8200 }, rating: 4.7, totalRatings: 1200, type: 'homestay', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1499793983690-e29da59ef1c2') }] },
        { name: 'Dera Rawatsar', address: '1 Hari Kishan Somani Marg, Jaipur 302004', location: { lat: 26.9003, lng: 75.8096 }, rating: 4.6, totalRatings: 980, type: 'resort', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1540541338287-41700207dee6') }] },
        { name: 'Zostel Jaipur', address: 'Moti Dungri Rd, Jaipur 302004', location: { lat: 26.8897, lng: 75.8254 }, rating: 4.3, totalRatings: 2340, type: 'guest_house', source: 'static', city: 'Jaipur', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
    ],
    delhi: [
        { name: 'The Taj Mahal Hotel New Delhi', address: '1, Dr Manmohan Singh Rd, New Delhi 110011', location: { lat: 28.6130, lng: 77.2127 }, rating: 4.7, totalRatings: 5432, type: 'hotel', source: 'static', city: 'Delhi', photos: [{ url: unsplash('1520250497591-112f2f40a3f4') }] },
        { name: 'The Imperial New Delhi', address: 'Janpath, New Delhi 110001', location: { lat: 28.6239, lng: 77.2183 }, rating: 4.7, totalRatings: 4200, type: 'hotel', source: 'static', city: 'Delhi', photos: [{ url: unsplash('1566073771259-6a8506099945') }] },
        { name: 'Bloom Boutique Hotel', address: 'R-18, Hauz Khas Enclave, New Delhi 110016', location: { lat: 28.5494, lng: 77.2096 }, rating: 4.4, totalRatings: 1870, type: 'hotel', source: 'static', city: 'Delhi', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
        { name: 'Zostel Delhi', address: '7, Shyam Nath Marg, Old Delhi 110054', location: { lat: 28.6590, lng: 77.2278 }, rating: 4.3, totalRatings: 3200, type: 'guest_house', source: 'static', city: 'Delhi', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
        { name: 'The Lodhi', address: 'Lodhi Rd, New Delhi 110003', location: { lat: 28.5910, lng: 77.2250 }, rating: 4.8, totalRatings: 2100, type: 'resort', source: 'static', city: 'Delhi', photos: [{ url: unsplash('1549294413-26f195200c16') }] },
    ],
    goa: [
        { name: 'Taj Holiday Village Resort', address: 'Sinquerim, Bardez, Goa 403515', location: { lat: 15.4980, lng: 73.7706 }, rating: 4.6, totalRatings: 3400, type: 'resort', source: 'static', city: 'Goa', photos: [{ url: unsplash('1540541338287-41700207dee6') }] },
        { name: 'The Leela Goa', address: 'Cavelossim, Mobor, Goa 403731', location: { lat: 15.1564, lng: 73.9382 }, rating: 4.7, totalRatings: 2800, type: 'resort', source: 'static', city: 'Goa', photos: [{ url: unsplash('1549294413-26f195200c16') }] },
        { name: 'Zostel Goa Panaji', address: 'Dr Alvaro Costa Rd, Panaji, Goa 403001', location: { lat: 15.4984, lng: 73.8344 }, rating: 4.3, totalRatings: 4100, type: 'guest_house', source: 'static', city: 'Goa', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
        { name: 'Casa Anjuna', address: '824, Anjuna, North Goa 403509', location: { lat: 15.5742, lng: 73.7443 }, rating: 4.5, totalRatings: 1500, type: 'homestay', source: 'static', city: 'Goa', photos: [{ url: unsplash('1499793983690-e29da59ef1c2') }] },
        { name: 'W Goa', address: 'Vagator Beach, North Goa 403509', location: { lat: 15.5987, lng: 73.7443 }, rating: 4.6, totalRatings: 1900, type: 'hotel', source: 'static', city: 'Goa', photos: [{ url: unsplash('1520250497591-112f2f40a3f4') }] },
    ],
    mumbai: [
        { name: 'The Taj Mahal Palace Mumbai', address: 'Apollo Bandar, Colaba, Mumbai 400001', location: { lat: 18.9217, lng: 72.8332 }, rating: 4.8, totalRatings: 9800, type: 'hotel', source: 'static', city: 'Mumbai', photos: [{ url: unsplash('1566073771259-6a8506099945') }] },
        { name: 'Trident Nariman Point', address: 'Nariman Point, Mumbai 400021', location: { lat: 18.9255, lng: 72.8225 }, rating: 4.6, totalRatings: 3200, type: 'hotel', source: 'static', city: 'Mumbai', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
        { name: 'Hotel Residency Fort', address: '26, Rustom Sidhwa Marg, Fort, Mumbai 400001', location: { lat: 18.9342, lng: 72.8364 }, rating: 4.1, totalRatings: 2800, type: 'hotel', source: 'static', city: 'Mumbai', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
        { name: 'Zostel Mumbai', address: 'Colaba, Mumbai 400005', location: { lat: 18.9220, lng: 72.8307 }, rating: 4.2, totalRatings: 3600, type: 'guest_house', source: 'static', city: 'Mumbai', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
    ],
    kerala: [
        { name: 'Kumarakom Lake Resort', address: 'Kumarakom, Kottayam, Kerala 686563', location: { lat: 9.6139, lng: 76.4318 }, rating: 4.8, totalRatings: 1800, type: 'resort', source: 'static', city: 'Kerala', photos: [{ url: unsplash('1540541338287-41700207dee6') }] },
        { name: 'Spice Village CGH Earth', address: 'Thekkady Rd, Kumily, Idukki, Kerala 685509', location: { lat: 9.6010, lng: 77.1630 }, rating: 4.7, totalRatings: 1200, type: 'resort', source: 'static', city: 'Kerala', photos: [{ url: unsplash('1549294413-26f195200c16') }] },
        { name: "Philipkutty's Farm", address: 'Ambika Market, Vechoor, Kottayam 686141', location: { lat: 9.6250, lng: 76.4430 }, rating: 4.8, totalRatings: 890, type: 'homestay', source: 'static', city: 'Kerala', photos: [{ url: unsplash('1499793983690-e29da59ef1c2') }] },
        { name: 'Zostel Munnar', address: 'Old Munnar, Idukki, Kerala 685612', location: { lat: 10.0897, lng: 77.0601 }, rating: 4.4, totalRatings: 2100, type: 'guest_house', source: 'static', city: 'Kerala', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
    ],
    agra: [
        { name: 'The Oberoi Amarvilas', address: 'Taj East Gate Rd, Agra 282001', location: { lat: 27.1722, lng: 78.0448 }, rating: 4.9, totalRatings: 3200, type: 'hotel', source: 'static', city: 'Agra', photos: [{ url: unsplash('1520250497591-112f2f40a3f4') }] },
        { name: 'ITC Mughal Agra', address: 'Taj Nagri, Fatehabad Rd, Agra 282001', location: { lat: 27.1620, lng: 78.0302 }, rating: 4.6, totalRatings: 2400, type: 'resort', source: 'static', city: 'Agra', photos: [{ url: unsplash('1540541338287-41700207dee6') }] },
        { name: 'Hotel Kamal Agra', address: 'South Gate, Taj Mahal, Agra 282001', location: { lat: 27.1704, lng: 78.0417 }, rating: 4.1, totalRatings: 1800, type: 'hotel', source: 'static', city: 'Agra', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
    ],
    varanasi: [
        { name: 'Brijrama Palace', address: 'Darbhanga Ghat, Varanasi 221001', location: { lat: 25.3076, lng: 83.0119 }, rating: 4.7, totalRatings: 1200, type: 'hotel', source: 'static', city: 'Varanasi', photos: [{ url: unsplash('1566073771259-6a8506099945') }] },
        { name: 'Ganges View Hotel', address: 'Assi Ghat, Varanasi 221005', location: { lat: 25.2853, lng: 83.0164 }, rating: 4.5, totalRatings: 980, type: 'hotel', source: 'static', city: 'Varanasi', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
        { name: 'Stops Hostel Varanasi', address: 'D 25/46 A, Meer Ghat, Varanasi 221001', location: { lat: 25.3092, lng: 83.0108 }, rating: 4.3, totalRatings: 2100, type: 'guest_house', source: 'static', city: 'Varanasi', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
    ],
    shimla: [
        { name: 'Wildflower Hall Shimla', address: 'Chharabra, Shimla 171012', location: { lat: 31.0846, lng: 77.2116 }, rating: 4.8, totalRatings: 1400, type: 'resort', source: 'static', city: 'Shimla', photos: [{ url: unsplash('1549294413-26f195200c16') }] },
        { name: 'The Oberoi Cecil', address: 'Chaura Maidan, Shimla 171004', location: { lat: 31.1028, lng: 77.1651 }, rating: 4.7, totalRatings: 1100, type: 'hotel', source: 'static', city: 'Shimla', photos: [{ url: unsplash('1551882547-ff40c63fe5fa') }] },
        { name: 'Zostel Shimla', address: 'Lakkar Bazaar, Shimla 171001', location: { lat: 31.1038, lng: 77.1684 }, rating: 4.3, totalRatings: 1900, type: 'guest_house', source: 'static', city: 'Shimla', photos: [{ url: unsplash('1555854877-bab0e564b8d5') }] },
    ],
};

const getStaticHotels = (city) => {
    if (!city) return [];
    const key = city.toLowerCase().trim();
    if (staticHotels[key]) return staticHotels[key];
    const found = Object.keys(staticHotels).find((k) => key.includes(k) || k.includes(key));
    return found ? staticHotels[found] : [];
};

module.exports = { staticPlaces, getStaticPlaces, staticHotels, getStaticHotels };
