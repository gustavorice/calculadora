function calcular(n1, n2) {
  n1 = parseFloat(document.getElementById("n1").value);
  n2 = parseFloat(document.getElementById("n2").value);

  selector = document.getElementById("selector").value;

  switch (selector) {
    case "+":
        calculo = (n1 + n2)
        document.getElementById("resultado").innerHTML = `O resultado dessa soma é ${calculo}`
        break;

     case "-":
        calculo = (n1 - n2)
        document.getElementById("resultado").innerHTML = `O resultado dessa subtração é ${calculo}`
        break;

    case "x":
        calculo = (n1 * n2)
        document.getElementById("resultado").innerHTML = `O resultado dessa multiplicação é ${calculo}`
        break;
    case "/":
        calculo = Math.round((n1 / n2))
        if(Number.isNaN(calculo)) {
            document.getElementById("resultado").innerHTML = `Por favor insira um divisor válido`
        } else {
        document.getElementById("resultado").innerHTML = `O resultado dessa divisão é ${calculo}`
         break;  
        }      
  }
}

console.log("ola");
