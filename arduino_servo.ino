#include <Servo.h>

Servo myServo;  // Crear un objeto Servo

void setup() {
    myServo.attach(6);  // Conectar el servo al pin 6
}

void loop() {
    myServo.write(0);   // Mover el servo a 0 grados
    delay(2000);        // Esperar 2 segundo
    myServo.write(30);  // Mover el servo a 30 grados
    delay(2000);        // Esperar 2 segundo
    myServo.write(60); // Mover el servo a 60 grados
    delay(2000);        // Esperar 1 segundo
    myServo.write(90);   // Mover el servo a 90 grados
    delay(2000);        // Esperar 1 segundo
    myServo.write(120);  // Mover el servo a 120 grados
    delay(2000);        // Esperar 1 segundo
    myServo.write(150); // Mover el servo a 150 grados
    delay(2000);        // Esperar 1 segundo

}