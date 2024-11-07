import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const obtenerSolicitudes = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/solicitudes`);
        return response.data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const obtenerUsuarios = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/usuarios`);
        return response.data; 
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
};

export const autenticarUser = async (formData) => {
    try {
        const response = await axios.post(`${apiUrl}/admin/login`,{
            username: formData.username,
            password: formData.password
        }, { withCredentials: true, });
        console.log("headers:", response.headers); 
        const token = response.data.token;
       if(token){
        console.log("autenticacion exitosa!");
        localStorage.setItem('auth_token', token);
        return true;
       }
    } catch (error) {
        console.error('Error eu:', error);
        return false;
    }
}

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