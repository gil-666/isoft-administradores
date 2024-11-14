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


export const obtenerSanciones = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/sanciones`);
        return response.data; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const obtenerProduccion = async () => {
  console.log("lol");
  try {
      const response = await axios.get(`${apiUrl}/admin/produccion`);
      return response.data; 
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};

export const obtenerRecompensas = async () => {
  console.log("lol");
  try {
      const response = await axios.get(`${apiUrl}/admin/recompensas`);
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
        });
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

export const insertarUsuario = async (formData) => {
    try {
      const response = await axios.post(`${apiUrl}/admin/usuarios`, {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
  
      console.log("headers:", response.headers);
      return true;
    } catch (error) {
      console.error('Error eu:', error);
      return false;
    }
  }
  
  export const insertarSancion = async (formData) => {
    try {
      const response = await axios.post(`${apiUrl}/admin/sanciones`, {
        Usuarios_id_usuario: formData.Usuarios_id_usuario, 
        sanc_motivo: formData.sanc_motivo,                  
        sanc_evidencia: formData.sanc_evidencia,            
        sanc_fechaHora: formData.sanc_fechaHora             
      });
  
      console.log("headers:", response.headers);
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

export const obtenerRe = async () => {
    console.log("lol");
    try {
        const response = await axios.get(`${apiUrl}/admin/solicitudes`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error; // tirar
    }
};