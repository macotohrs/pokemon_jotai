import { Suspense } from "react";
import "./App.css";
import { atom, Provider, useAtom } from "jotai";

const URL ="https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json";
const filterAtom = atom("");

export const pokemonAtom = atom(async () =>
fetch(URL).then((resp) => resp.json())
);
export const filteredPokemonAtom = atom((get) =>
get(pokemonAtom).filter((p) =>
  p.name.english.toLowerCase().includes(get(filterAtom).toLowerCase())
)
);

const FilterInput = () => {
  const [filter, filterSet] = useAtom(filterAtom); // useStateみたいなもの top level においてはいけない

  return <input value={filter} onChange={(e) => filterSet(e.target.value)} />;
};

const PokemonTable = () => { // ReactコンポーネントやカスタムReactフック内でuseAtomを使用する場合、関数名は大文字
  const [pokemon] = useAtom(pokemonAtom); 
  const [filter] = useAtom(filterAtom);

  return (
    <table width={"100%"}>
      <tbody>
        {pokemon.filter(pk => pk.name.english.toLowerCase().includes(filter))
        .map((p, index)=>(
          <tr key ={index}>
            <td>{p.id}</td>
            <td>{p.name.english}</td>
            <td>{p.type.join(",")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

function App() {
  return (
    <div className="App">
      <FilterInput />
      <PokemonTable />
    </div>
  );
}

export default () => (
  <Provider>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </Provider>
);
