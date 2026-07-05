Hoje aprendi (de novo) que Angular Signals NÃO é mágica.

Já tinha passado por isso antes e jurei que não aconteceria novamente. E aqui estou eu, caindo no mesmo erro.

Contexto: Tenho um carrinho de compras em Angular 22. Uso signals para o estado, computed para derivados (itemCount, total). Tudo lindo. Os testes passam. A lógica de negócio funciona.

A UI não atualiza.

O badge do carrinho fica em 1 mesmo adicionando 10 produtos. O botão de remover não faz nada na tela (mesmo o localStorage sendo atualizado corretamente).

O culpado? Esse padrão:

const cart = this.#cart();   // leio
cart.addItem(...);           // muto
this.#cart.set(cart);        // seto → o MESMO objeto

Angular usa Object.is para comparar valores em signal.set(). Object.is(cart, cart) é true. Não importa o quanto você tenha mutado o objeto internamente — se a referência é a mesma, Angular assume que nada mudou e não notifica ninguém.

Os testes passavam porque leem os computed diretamente, não passam pelo sistema reativo de templates. O teste unitário vê o valor correto. O template nunca fica sabendo.

A solução é ridiculamente simples: clonar o objeto antes de mutá-lo para que signal.set() receba uma referência nova.

Mas o importante não é a solução, é o padrão mental:

Signals não são "observáveis mágicos". São caixas. Object.is olha a caixa, não o conteúdo. Se você coloca a mesma caixa de volta, ele assume que nada mudou.

De agora em diante, sempre que vir get → mutate → set no mesmo objeto, sei que tem um bug esperando para acontecer.

Já aconteceu algo similar com você? Algum teste disse que estava tudo bem mas a UI mostrou outra coisa?
