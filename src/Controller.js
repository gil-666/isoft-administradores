const apiUrl = import.meta.env.VITE_API_URL;

export const obtenerSolicitudes = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/solicitudes`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error; // Propagate the error
    }
};

export const obtenerRe = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/solicitudes`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error; // Propagate the error
    }
};