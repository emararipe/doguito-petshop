export function valida(input) {
  const tipoInput = input.dataset.tipo;

  if (validadores[tipoInput]) {
    validadores[tipoInput](input);
  }

  if (!input.validity.valid) {
    input.parentElement.classList.add("input-container--invalido")
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemErro(tipoInput, input)
  } else {
    input.parentElement.classList.remove("input-container--invalido")
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = ""
  }
}

function mostraMensagemErro(tipoDeInput, input) {
  let mensagem = ""
  tiposDeErro.forEach(erro => {
    if(input.validity[erro]){
      mensagem = mensagensDeErro[tipoDeInput][erro]
    }
  }
)
  return mensagem

}

const tiposDeErro = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError"
]

const mensagensDeErro = {
  nome: {
    valueMissing: "O campo nome não pode estar em vazio."
  },

  email: {
    valueMissing: "O campo email não pode estar em vazio.",
    patternMismatch: "Por favor, insira um endereço de e-mail válido. Ex.: user@domain.com, user@edu.br"
  },

  senha: {
    valueMissing: "O campo senha não pode estar em vazio.",
    patternMismatch: "A senha deve conter entre 6 e 12 caracteres, contendo pelo menos uma letra maiúscula, um número e não deve conter símbolos."
  },

  dataNascimento: {
    valueMissing: "O campo da data de nascimento não pode estar em vazio.",
    customError: "Você precisa ter mais de 18 anos para se cadastrar."
  }
}


const validadores = {
  dataNascimento: input => validaNascimento(input), 
};

function validaNascimento(input) {
  if (!input) return false;
  const dataRecebida = new Date(input);
  let mensagem = "";

  if (!maiorDeIdade(dataRecebida)) {
    mensagem = "Você precisa ter mais de 18 anos para se cadastrar.";
  }

  maiorDeIdade(dataRecebida);

  input.setCustomValidity(mensagem);
}

function maiorDeIdade(data) {
  const dataHoje = new Date();
  const idadeMs = Math.abs(dataHoje.getTime() - data.getTime());
  const idade18AnosMs = 567648e6;
  return idadeMs >= idade18AnosMs; // que vai ser true ou false
}
