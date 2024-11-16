# isoft-administradores

Administradores | ingenieria de software

## Configuración recomendada del IDE (editor de codigo)

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Requisitos

**Windows** o **Linux**   
**Node.js** = https://nodejs.org/en/download/package-manager   
**Git**(probablemente ya lo tengas instalado) = https://git-scm.com/downloads   

## Instrucciones
En una ventana de cmd o terminal:
```
git clone https://github.com/gil-666/isoft-administradores.git
cd isoft-administradores
```
### Una vez clonado el proyecto, corre estos comandos para iniciar el proyecto en tu PC

```sh
npm install
npm run dev
```
Nota: se debe crear un archivo llamado ***.env.development*** en la raiz del proyecto para acceder al modelo y base de datos, con este contenido:
```sh
VITE_API_URL="ipdelservidor"
```
*la ip se le pregunta al desarrollador crack

## Otros comandos (extra info)
### Compilar y recargar en caliente para desarrollo (este se usa cuando estes desarrollando)

```sh
npm run dev
```

### Compilar y minimizar para producción (este se corre justo antes de presentar avances y solo lo hace 1 desarollador)

```sh
npm run build
```
