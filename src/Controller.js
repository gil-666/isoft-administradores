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

export const obtenerRutas = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/rutas`);
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

export const obtenerProduccionInv = async () => { //obtener produccion en inventario
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/produccion/inventario`);
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

export const obtenerPlantas = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/recompensas/plantas`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const obtenerRecompensaUsuario = async (formData) => { //si se especifica, obtiene un ciudadanos en particular
  try {
    const response = await axios.post(`${apiUrl}/admin/recompensas`, formData);

    console.log("headers:", response.headers);
    return response.data;
  } catch (error) {
    console.error('Error eu:', error);
    return false;
  }
}

export const obtenerDesechosInventario = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/produccion/desechosinv`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const obtenerDesechosHistorial = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/produccion/desechoshistorial`);
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

export const obtenerEnvios = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/produccion/envios`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const obtenerRecolectores = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`${apiUrl}/admin/recolectores`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const obtenerCiudadanos = async (formData) => { //si se especifica, obtiene un ciudadanos en particular
  try {
    const response = await axios.post(`${apiUrl}/admin/ciudadanos`, formData);

    console.log("headers:", response.headers);
    return response.data.resultsWithBase64;
  } catch (error) {
    console.error('Error eu:', error);
    return false;
  }
}

export const autenticarUser = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/login`, {
      username: formData.username,
      password: formData.password
    });
    console.log("headers:", response.headers);
    const token = response.data.token;
    const user = response.data.user;
    if (token) {
      console.log("autenticacion exitosa!");
      localStorage.setItem('auth_token', token);
      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          localStorage.setItem(key, JSON.stringify(user[key]));
        }
      }
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

export const actualizarUsuario = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/usuarios/update`, {
      Usuarios_id_usuario: formData.id_usuario,
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

export const actualizarFotoUsuario = async (formData) => {
  console.log("Sending form data:", formData);
  try {
    const response = await axios.post(`${apiUrl}/admin/usuarios/update-photo`, formData, {
    });
    console.log("Response:", response.data);
    return true;
  } catch (error) {
    console.error('Error updating photo:', error.response ? error.response.data : error.message);
    return false;
  }
};


export const actualizarEstadoUsuario = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/usuarios/update-status`, {
      id_usuario: formData[0].id_usuario,
      estado: formData[0].estado
    });

    console.log("headers:", response.headers);
    return true;
  } catch (error) {
    console.error('Error al actualizar estado de usuario:', error);
    return false;
  }
};
export const actualizarRecolectorRuta = async (formData) => {
  try {
    console.log("sending recolector", formData[0].idsol_usuario);
    const response = await axios.post(`${apiUrl}/admin/rutas/update-recolector`, {
      idsol_usuario: formData[0].idsol_usuario,
      id_recolector: formData[0].id_recolector
    });

    console.log("headers:", response.headers);
    return true;
  } catch (error) {
    console.error('Error al actualizar recolector:', error);
    return false;
  }
};
export const actualizarEstadoRecoleccion = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/solicitudes`, formData[0]);

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
      sanc_fechaHora: formData.sanc_fechaHora,
      sanc_estado: formData.sanc_estado
    });

    console.log("headers:", response.headers);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const actualizarSancion = async (formData) => {
  try {
    const response = await axios.put(`${apiUrl}/admin/sanciones`, {
      Usuarios_id_usuario: formData.Usuarios_id_usuario,
      sanc_motivo: formData.sanc_motivo,
      sanc_evidencia: formData.sanc_evidencia,
      sanc_fechaHora: formData.sanc_fechaHora,
      id_sancion: formData.id_sancion
    });

    console.log("headers:", response.headers);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const actualizarEstadoSancion = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/sanciones/estado`, formData[0]);

    console.log("headers:", response.headers);
    return true;
  } catch (error) {
    console.error('Error eu:', error);
    return false;
  }
}

export const eliminarSancion = async (id_sancion) => {
  try {
    const response = await axios.delete(`${apiUrl}/admin/sanciones/${id_sancion}`);
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

export const obtenerLOC = async () => {
  console.log("lol");
  try {
    const response = await axios.get(`https://api.codetabs.com/v1/loc?github=gil-666/isoft-administradores`);
    // console.log("loc", response.data[8].linesOfCode);
    return response.data[0].linesOfCode;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};