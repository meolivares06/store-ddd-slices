Hoy aprendí (de nuevo) que Angular Signals NO es magia.

Me pasó algo que ya me había pasado antes y juré que no me volvería a pasar. Y acá estoy, comiendo del mismo plato.

Contexto: Tengo un carrito de compras en Angular 22. Uso signals para el estado, computed para derivados (itemCount, total). Todo hermoso. Los tests pasan. La lógica de negocio funciona.

La UI no se actualiza.

El badge del carrito se queda en 1 aunque agregue 10 productos. El botón de eliminar no hace nada en pantalla (aunque el localStorage se actualiza bien).

¿El culpable? Este patrón:

const cart = this.#cart();   // leo
cart.addItem(...);           // muto
this.#cart.set(cart);        // seteo → el MISMO objeto

Angular usa Object.is para comparar valores en signal.set(). Object.is(cart, cart) es true. No importa cuánto hayas mutado el objeto internamente — si la referencia es la misma, Angular asume que nada cambió y no notifica a nadie.

Los tests pasaban porque leen los computed directo, no pasan por el sistema reactivo de templates. El test unitario ve el valor correcto. El template nunca se entera.

La solución es ridículamente simple: clonar el objeto antes de mutarlo para que signal.set() reciba una referencia nueva.

Pero lo importante no es la solución, es el patrón mental:

Signals no son "observables mágicos". Son cajas. Object.is mira la caja, no el contenido. Si metés la misma caja, asume que todo sigue igual.

Desde ahora, cada vez que vea get → mutate → set en el mismo objeto, sé que hay un bug durmiendo.

¿Te pasó algo similar? ¿Alguna vez un test te dijo que todo bien pero la UI te mostró otra cosa?
