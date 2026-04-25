const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getImageUrl(imageId) {
  return `${API_URL}/api/images/${imageId}`;
}

export async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('freshbooking_token') : null;
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Properties
export const getProperties = (params = '') => apiFetch(`/api/properties${params ? '?' + params : ''}`);
export const getMyProperties = () => apiFetch('/api/properties/my');
export const getFeaturedProperties = () => apiFetch('/api/properties/featured');
export const getNewLaunches = () => apiFetch('/api/properties/new-launches');
export const getTrendingProperties = () => apiFetch('/api/properties/trending');
export const getProperty = (id) => apiFetch(`/api/properties/${id}`);
export const createProperty = (data) => apiFetch('/api/properties', { method: 'POST', body: JSON.stringify(data) });
export const updateProperty = (id, data) => apiFetch(`/api/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProperty = (id) => apiFetch(`/api/properties/${id}`, { method: 'DELETE' });

// Images
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch('/api/images/upload', { method: 'POST', body: formData });
};
export const deleteImage = (id) => apiFetch(`/api/images/${id}`, { method: 'DELETE' });

// Admin
export const getAdminProperties = () => apiFetch('/api/admin/properties?limit=1000');
export const getUsers = () => apiFetch('/api/admin/users');
export const deleteUser = (id) => apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
export const toggleFeature = (id) => apiFetch(`/api/admin/properties/${id}/feature`, { method: 'PUT' });
export const toggleVerify = (id) => apiFetch(`/api/admin/properties/${id}/verify`, { method: 'PUT' });
export const toggleNewLaunch = (id) => apiFetch(`/api/admin/properties/${id}/new-launch`, { method: 'PUT' });
export const toggleTrending = (id) => apiFetch(`/api/admin/properties/${id}/trending`, { method: 'PUT' });
export const getInquiries = (token) => apiFetch('/api/inquiries', { headers: { Authorization: `Bearer ${token}` } });

// Banners (public)
export const getBanners = () => apiFetch('/api/banners');

// Banners (admin)
export const getAdminBanners = () => apiFetch('/api/admin/banners');
export const createBanner = (data) => apiFetch('/api/admin/banners', { method: 'POST', body: JSON.stringify(data) });
export const updateBanner = (id, data) => apiFetch(`/api/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBanner = (id) => apiFetch(`/api/admin/banners/${id}`, { method: 'DELETE' });

// Utility
export function formatPrice(price) {
  if (!price) return '₹ Price on Request';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatArea(area) {
  if (!area) return '';
  return `${area.toLocaleString()} sq.ft`;
}

export const CITIES = [
  'Adoni', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 
  'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Anand', 'Anantapur', 'Asansol', 'Aurangabad', 'Bally', 'Bangalore', 
  'Barasat', 'Bardhaman', 'Bareilly', 'Bathinda', 'Begusarai', 'Belgaum', 'Bellary', 'Berhampore', 'Bhagalpur', 
  'Bharatpur', 'Bhatpara', 'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bihar Sharif', 
  'Bikaner', 'Bilaspur', 'Bokaro', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Darbhanga', 'Davanagere', 
  'Dehradun', 'Delhi', 'Deoghar', 'Dhanbad', 'Dhule', 'Dindigul', 'Durgapur', 'Erode', 'Etawah', 'Faridabad', 
  'Farrukhabad', 'Firozabad', 'Gandhinagar', 'Gaya', 'Ghaziabad', 'Gopalpur', 'Gorakhpur', 'Gulbarga', 'Guntur', 
  'Gurgaon', 'Guwahati', 'Gwalior', 'Haldia', 'Hapur', 'Haridwar', 'Hindupur', 'Hisar', 'Hosur', 'Howrah', 
  'Hubli-Dharwad', 'Hyderabad', 'Ichalkaranji', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 
  'Jalna', 'Jamalpur', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur', 'Junagadh', 'Kadapa', 'Kakinada', 
  'Kalyan-Dombivli', 'Kamarhati', 'Kanpur', 'Karaikudi', 'Karimnagar', 'Karnal', 'Katihar', 'Khammam', 'Khandwa', 
  'Kharagpur', 'Khorabar', 'Kochi', 'Kolhapur', 'Kolkata', 'Kollam', 'Korba', 'Kota', 'Kozhikode', 'Kulti', 
  'Kurnool', 'Latur', 'Loni', 'Lucknow', 'Ludhiana', 'Madurai', 'Maheshtala', 'Malegaon', 'Mangalore', 'Mango', 
  'Mathura', 'Mau', 'Meerut', 'Mira-Bhayandar', 'Mirzapur', 'Moradabad', 'Mumbai', 'Muzaffarnagar', 'Muzaffarpur', 
  'Mysore', 'Nadiad', 'Nagercoil', 'Nagpur', 'Naihati', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'New Delhi', 
  'Nizamabad', 'Noida', 'North Dumdum', 'Ozhukarai', 'Pali', 'Panihati', 'Panipat', 'Parbhani', 'Patiala', 'Patna', 
  'Pondicherry', 'Pune', 'Purnia', 'Raebareli', 'Raichur', 'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Ratlam', 
  'Rewa', 'Rohtak', 'Rourkela', 'Sagar', 'Saharanpur', 'Salem', 'Sangli-Miraj & Kupwad', 'Satna', 'Secunderabad', 
  'Serampore', 'Shahjahanpur', 'Shimla', 'Shivamogga', 'Siliguri', 'Solapur', 'Sonipat', 'South Dumdum', 
  'Sri Ganganagar', 'Srinagar', 'Surat', 'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 
  'Tiruppur', 'Tiruvottiyur', 'Tumkur', 'Udaipur', 'Ujjain', 'Ulhasnagar', 'Uluberia', 'Vadodara', 'Varanasi', 
  'Vasai-Virar', 'Vellore', 'Vijayawada', 'Visakhapatnam', 'Warangal', 'Yamunanagar'
];

export const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'independent_house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot/Land' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop/Showroom' },
];
