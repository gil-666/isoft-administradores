export function fechayHora(date) { //ej. jueves, 2 de noviembre 2024, 14:23:00 p.m
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: "long",
        hour12: "true"
      });
      return formatter.format(new Date(date));
  }

  export function fechaCorto(date) { //ej. 02/11/24, 14:23:00
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return formatter.format(new Date(date));
  }

  export function printPage(){
    if (typeof window !== 'undefined') {
      window.print(); 
    }
  }

  export const formatDateSQL = (date) => {
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  export function mayusOracion(string){
    const primeraLetra = String(string).charAt(0).toString().toUpperCase();
    const resto = String(string).slice(1);
    return primeraLetra+resto;
  }