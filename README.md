# EasyArduino
EasyArduino: programación por bloques para Arduino. Trabajo Fin de Grado 2015 - Grado en Ingeniería Informática - UNED

http://www.easyarduino.es/

# Descripción
EasyArduino es una aplicación web que permite la elaboración de programas para Arduino sin necesidad de escribir el código con la sintaxis de sus órdenes. Esta herramienta está basada en la tecnología de programación mediante bloques funcionales tan extendida en la actualidad.

Esta posibilidad gráfica de elaborar programas es muy útil cuando estamos utilizando la Plataforma Arduino en niveles educativos. La facilidad de realizar la aplicación gráficamente permite que el alumno se dedique a pensar en el algoritmo más que en la corrección del código escrito.

# Instalación
Para empezar a trabajar lo primero que tenemos que  hacer es instalar el software necesario y para ello deberemos descargar e instalar el entorno Arduino siguiendo las instrucciones de http://arduino.cc/en/Main/Software

Conectamos la placa Arduino a un puerto USB de nuestro ordenador, a continuación abrimos el programa Arduino y en el menú Herramientas-Placa seleccionamos la placa que vamos a utilizar.
 
El siguiente paso es descargar la librería Thread.h

https://github.com/ivanseidel/ArduinoThread. 

Una vez descargada necesitamos descomprimir el archivo; a la carpeta le llamaremos ArduinoThread; esta carpeta la copiaremos tal cual está en donde tengamos nuestro Arduino, en la carpeta libraries. Reiniciar el IDE Arduino para que reconozca las librerías nuevas.

# Programando
Ahora que tenemos todo listo podemos empezar a programar. En EasyArduino colocaremos los bloques en la secuencia deseada, si vamos a la pestaña Código veremos cómo se genera el código automáticamente. Una vez terminado le damos a GuardarArduino y nuestro programa se guardará en un archivo en la carpeta que hayamos seleccionado. Abrimos dicho archivo en el entorno Arduino y le damos a verificar. Esto comprobará que no hay errores en la secuencia de código, una vez hecho esto ya podemos subir nuestro programa a la placa.
