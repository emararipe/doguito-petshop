export function valida(input) {
  const tipoInput = input.dataset.tipo;

  if (validadores[tipoInput]) {
    validadores[tipoInput](input);
  }

  if (!input.validity.valid) {
    input.parentElement.classList.add("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML =
      mostraMensagemErro(tipoInput, input);
  } else {
    input.parentElement.classList.remove("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = "";
  }
}

function mostraMensagemErro(tipoInput, input) {
  let mensagem = "";
  tiposDeErro.forEach((erro) => {
    if (input.validity[erro]) {
      mensagem = mensagensDeErro[tipoInput][erro];
    }
  });
  return mensagem;
}

const tiposDeErro = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError",
];

const mensagensDeErro = {
  nome: {
    valueMissing: "O campo nome não pode estar em vazio.",
  },

  email: {
    valueMissing: "O campo email não pode estar em vazio.",
    patternMismatch:
      "Por favor, insira um endereço de e-mail válido. Ex.: user@domain.com, user@edu.br.",
  },

  senha: {
    valueMissing: "O campo senha não pode estar em vazio.",
    patternMismatch:
      "A senha deve conter entre 6 e 12 caracteres, contendo pelo menos uma letra maiúscula, um número e não deve conter símbolos.",
  },

  dataNascimento: {
    valueMissing: "O campo data de nascimento não pode estar em vazio.",
    customError: "Você precisa ter mais de 18 anos para se cadastrar.",
  },

  cpf: {
    valueMissing: "O campo CPF não pode estar em vazio.",
    customError: "Por favor, insira um CPF válido.",
  },

  cep: {
    valueMissing: "O campo CEP não pode estar em vazio.",
    patternMismatch:
      "Por favor, insira um formato de CEP válido. Ex.: 00000-000, 00000000",
    customError:
      "Não foi possível encontrar este CEP. Por favor, insira um CEP válido.",
  },

  logradouro: {
    valueMissing: "O campo logradouro não pode estar em vazio.",
  },

  cidade: {
    valueMissing: "O campo cidade não pode estar em vazio.",
  },

  estado: {
    valueMissing: "O campo estado não pode estar em vazio.",
  },

  nome: {
    valueMissing: "O campo nome não pode estar em vazio.",
  },

  preco: {
    valueMissing: "O campo preco não pode estar em vazio.",
  },
};

const validadores = {
  dataNascimento: (input) => validaNascimento(input),
  cpf: (input) => validaCPF(input),
  cep: (input) => recuperarCEP(input),
};

function validaNascimento(input) {
  if (!input.value) return false;
  const dataRecebida = new Date(input.value);
  let mensagem = "";

  if (!maiorDeIdade(dataRecebida)) {
    mensagem = "Você precisa ter mais de 18 anos para se cadastrar.";
  }

  input.setCustomValidity(mensagem);
}

function maiorDeIdade(data) {
  const dataHoje = new Date();
  const idadeMs = Math.abs(dataHoje.getTime() - data.getTime());
  const idade18AnosMs = 567648e6;
  return idadeMs >= idade18AnosMs;
}

function validaCPF(input) {
  const CPFformatado = input.value.replace(/\D/g, "");
  let mensagem = "";

  if (!checaCPFRepetido(CPFformatado) || !checaEstruturaCPF(CPFformatado)) {
    mensagem = "O CPF digitado não é válido";
  }

  input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpf) {
  const valoresRepetidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  let CPFValido = true;

  valoresRepetidos.forEach((valor) => {
    if (valor == cpf) {
      CPFValido = false;
    }
  });

  return CPFValido;
}

function checaEstruturaCPF(cpf) {
  const multiplicador = 10;

  return checaDigitoVerificador(cpf, multiplicador);
}

function checaDigitoVerificador(cpf, multiplicador) {
  if (multiplicador >= 12) {
    return true;
  }

  let multiplicadorInicial = multiplicador;
  let soma = 0;
  const cpfSemDigitos = cpf.substr(0, multiplicador - 1);
  const digitoVerificador = cpf.charAt(multiplicador - 1);

  for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
    soma = +cpfSemDigitos[contador] * multiplicadorInicial;
    contador++;
  }

  if (digitoVerificador == confirmaDigito(soma)) {
    return checaDigitoVerificador(cpf, multiplicador + 1);
  }

  return false;
}

function confirmaDigito(soma) {
  return 11 - (soma % 11);
}

function recuperarCEP(input) {
  const CEPformatado = input.value.replace(/\D/g, "");
  const urlAPI = `https://viacep.com.br/ws/${CEPformatado}/json/`;
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "content-type": "application/json;charset=utf-8",
    },
  };

  if (!input.validity.valueMissing && !input.validity.patternMismatch) {
    async function pegarCEP() {
      const response = await fetch(urlAPI, options);
      const data = await response.json();
      if (data.erro) {
        input.setCustomValidity(
          "Não foi possível encontrar este CEP. Por favor, insira um CEP válido."
        );
        return;
      }
      input.setCustomValidity("");
      preencheCamposCEP(data);
    }
    pegarCEP();
  }
}

function preencheCamposCEP(data) {
  const logradouro = document.querySelector('[data-tipo="logradouro"]');
  const cidade = document.querySelector('[data-tipo="cidade"]');
  const estado = document.querySelector('[data-tipo="estado"]');

  logradouro.value = data.logradouro;
  cidade.value = data.localidade;
  estado.value = data.uf;
}
