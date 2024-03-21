let divColors = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#5AC7E8",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    electric: "#ffee00",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#808080",
    ghost: "#705898",
    dragon: "#DCAA2B",
    // ice: "#6890F0",
    dark: "#705848",
  };
  
  let pokemonTypes = [];
  let updatedPokeArr = [];
  let pokemonContainer = document.querySelector("#pokemon-container");
  let selectTypes = document.querySelector("select");
  let searchBar = document.querySelector("#searchBar");
  let filterBtn = document.querySelector("#filterButton");
  let modal = document.querySelector(".modal");
  let dialog = document.querySelector("#myDialog");
  let topBtn = document.querySelector("#top");
  
  //---------back to top----------
  window.addEventListener("scroll", () => {
    topBtn.style.transition = "all 1s";
    if (window.innerHeight + window.scrollY == window.innerHeight) {
      topBtn.style.display = "none";
    } else {
      topBtn.style.display = "block";
    }
  });
  
  // dialog box close
  function closeDialog() {
    document.body.style.overflowY = "scroll"
    dialog.close();
  }
  
  // DialogBox Close
  dialog.addEventListener('click', function(e){
    e.preventDefault();
    if(e.target.id == "myDialog"){
      closeDialog();
    }
  })
  
  // Dialog box open
  function openDetails(
    name,
    img,
    move1,
    move2,
    move3,
    move4,
    height,
    weight,
    order
  ) {
    modal.innerHTML = `
    <svg onclick="closeDialog()" id="closeBtn" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="red" d="M20 6.4L17.6 4 12 9.6 6.4 4 4 6.4 9.6 12 4 17.6 6.4 20 12 14.4 17.6 20 20 17.6 14.4 12z"/>
    </svg>

    <h1 class="model_Name">${name}</h1>
    <img src="${img}" alt="" class="model_Image" />
    <h3 class = modal_Moves>Moves</h3>
    <ul>
      <div class = "list">
        <li>${move1}</li>
        <li>${move2}</li>
      </div>
      <div class = "list">
        <li>${move3}</li>
        <li>${move4}</li>
      </div>
    </ul>
    <div class="specs">
      <h4>height: ${height}</h4>
      <h4>order: ${order}</h4>
      <h4>weight: ${weight}</h4>
    </div>
    `;
    document.body.style.overflow = "hidden"
    dialog.show();
  }
  
  // Append cards
  function appendCards(finalArr) {
    pokemonContainer.innerHTML = "";
    selectTypes.innerHTML = `
      <option value="" selected disabled>Select Type</option>
      `;
    finalArr.forEach((poke) => {
      const div = document.createElement("div");
      let move1 = poke.moves[0],
        move2 = poke.moves[1],
        move3 = poke.moves[2],
        move4 = poke.moves[3];
      div.classList.add(`box`);
      div.setAttribute("data-id", "flip-up");
      let poketype = poke.type;
      let pokecolor = divColors[poketype] || "#A0CF59";
      div.innerHTML = `
                <div class="box-content" onclick = "openDetails('${poke.name}', '${poke.largeImg}', '${move1}', '${move2}', '${move3}', '${move4}', '${poke.height}', '${poke.weight}', '${poke.order}')">
                    <div class="box-front" style='background: radial-gradient(circle at 50% 0%, ${pokecolor} 50%, #ffffff 36%)'>
                        <p class="pokeId">#${poke.id}</p>
                        <img src="${poke.image}" alt="${poke.name}" class="pokeImg" />
                        <h2 class="pokeName">${poke.name}</h2>
                        <span class="pokeType">${poke.type}</span>
                    </div>
                    <div class="box-back" style='background: radial-gradient(circle at 50% 100%, ${pokecolor} 50%, #ffffff 36%)'>
                        <p class="pokeBackId">#${poke.id}</p>
                        <img src="${poke.backImage}" alt="${poke.name}" class="pokeBackImg" />
                        <span class="pokeAbility">Abilities:<br><span>${poke.ability}</span></span>
                    </div>
                </div>
                `;
      pokemonContainer.appendChild(div);
    });
  }
  
  // Add Options for filter
  function appendOptions(finalArr) {
    finalArr.sort((a, b) => {
      return a.type < b.type ? -1 : 1;
    });
    selectTypes.innerHTML = `
      <option value="" selected disabled>Select Type</option>
      `;
    pokemonTypes = [];
    finalArr.forEach((poke) => {
      const option = document.createElement("option");
      if (!pokemonTypes.includes(`${poke.type}`)) {
        pokemonTypes.push(`${poke.type}`);
        option.value = `${poke.type}`;
        option.innerHTML = `${poke.type}`;
        selectTypes.appendChild(option);
      }
    });
  }
  
  // search Event
  searchBar.addEventListener("keyup", (e) => {
    e.preventDefault();
    let newArr = updatedPokeArr.filter((ele) => {
      return ele.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        ? true
        : false;
    });
    appendCards(newArr);
    appendOptions(newArr);
  });
  
  // Filter Button Event
  //! Adding toastr for error
  filterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let filterValue = selectTypes.value;
    if (filterValue == "") {
      toastr.options.closeMethod = "fadeOut";
      toastr.options.closeDuration = 100;
      toastr.options.closeEasing = "swing";
      toastr.options.closeButton = true;
      toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';
      toastr.error("Select a Type");
      return;
    }
    let filteredArray = updatedPokeArr.filter((ele) => {
      return ele.type === filterValue ? true : false;
    });
    appendCards(filteredArray);
    appendOptions(updatedPokeArr);
  });
    
  // fetch items from API
  let fetchPokemons = () => {
    let pokeArr = [];
    for (let i = 1; i <= 201; i++) {
      pokeArr.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json())
      );
    }
    Promise.all(pokeArr).then((currPokemon) => {
      updatedPokeArr = currPokemon.map((pokemon) => {
        return {
          id: pokemon.id,
          image: pokemon.sprites.front_default,
          name: pokemon.name,
          type: pokemon.types[0].type.name,
          backImage: pokemon.sprites.back_shiny,
          largeImg: pokemon.sprites.other.home.front_shiny,
          moves: pokemon.moves.map((moves) => moves.move.name),
          ability: pokemon.abilities
            .map((ability) => ability.ability.name)
            .join(", "),
          height: pokemon.height,
          weight: pokemon.weight,
          order: pokemon.order,
        };
      });
      appendCards(updatedPokeArr);
      appendOptions(updatedPokeArr);
    });
  };
  fetchPokemons();
  
  
  // Reset Button
  function resetBtn(e) {
    e.preventDefault();
    window.location.reload();
  }
