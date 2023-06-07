import { useEffect } from "react";
import "./App.css";
import { atom, Provider, useAtom } from "jotai";

const URL ="https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json";
const pokemonAtom = atom([]);
const filterAtom = atom("");

const FilterInput = () => {
  const [filter, filterSet] = useAtom(filterAtom); // useStateみたいなもの top level においてはいけない

  return <input value={filter} onChange={(e) => filterSet(e.target.value)} />;
};

const PokemonTable = () => { // ReactコンポーネントやカスタムReactフック内でuseAtomを使用する場合、関数名は大文字
  const [pokemon] = useAtom(pokemonAtom); 
  const [filter, filterSet] = useAtom(filterAtom);

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
  const [pokemon, pokemonSet] = useAtom(pokemonAtom);
  useEffect(()=>{
    fetch(URL)
    .then(resp => resp.json())
    .then(pokemonSet)
  },[])
  
  return (
    <div className="App">
      <FilterInput />
      <PokemonTable />
    </div>
  );
}

export default () => (
  <Provider>
    <App />
  </Provider>
);
