import {describe, expect, test} from "vitest";
import {comprobarClickEnTopo, actualizarPuntuacio} from "../src/components/content.js"

describe("comprobarClickEnTopo", () => {
  test("click en madriguera vacía", () => {
    const id = 10;
    const topos = { 1: 38, 2: 80, 3: 48, 4: 18, 5: 69, 6: 59, 7: 47 };
    const resultado = comprobarClickEnTopo(id, topos);
    expect(resultado).toStrictEqual(0);
  });
  
  test("click en madriguera con topo", () => {
    const id = 80;
    const topos = { 1: 38, 2: 80, 3: 48, 4: 18, 5: 69, 6: 59, 7: 47 };
    const resultado = comprobarClickEnTopo(id, topos);
    expect(resultado).toStrictEqual(2);
  });  
});

describe("actualizarPuntuacio", () => {
  test("incrementar puntuación", () => {
    const state = { puntuacio: 10 };
    const delta = 1;
    const resultado = actualizarPuntuacio(state, delta);
    expect(resultado.puntuacio).toStrictEqual(11);
  });

  test("puntuacio no pot ser menor de 0", () => {
    const state = { puntuacio: 1 };
    const delta = -20;
    const resultado = actualizarPuntuacio(state, delta);
    expect(resultado.puntuacio).toStrictEqual(0);
  }); 
});