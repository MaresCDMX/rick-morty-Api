import "./App.css";
import Logo from "./Logo";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { FcLike } from "react-icons/fc";
import { FcDislike } from "react-icons/fc";
import { FcQuestions } from "react-icons/fc";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
let myArrOfCharacter = [];
let characteresTemp = [];
let myLength = 0;

const ResidentsContainer = ({ residents }) => {
  const [myResidents, setMyResidents] = useState("");
  useEffect(() => {
    if (residents) {
      if (residents.length > 0) {
        myLength = residents.length;
        for (let i = 0; i < myLength; i++) {
          /*if (i >= 10) {
            break;
          }*/
          axios.get(`${residents[i]}`).then((res) => {
            characteresTemp.push(res.data);
            setMyResidents(res.data);
          });
        }
      }
    }
  }, [residents]);

  console.log(characteresTemp);
  if (characteresTemp.length > 0) {
    myArrOfCharacter = characteresTemp.map((value) => (
      <ResidentInfo
        key={value.id}
        name={value.name}
        image={value.image}
        status={value.status}
        origin={value.origin.name}
        episode={value.episode.length}
      />
    ));
  }

  return <div>{residents && myArrOfCharacter}</div>;
};

const ResidentInfo = ({ name, image, status, origin, episode }) => {
  return (
    <>
      <div className="gallery">
        <Card style={{ width: "14rem" }}>
          <Card.Img variant="top" src={image} />
          <Card.Body>
            <Card.Title>Name: {name}</Card.Title>
            <br />
            <Card.Text>
              {status === "Alive" ? (
                <FcLike />
              ) : status === "Dead" ? (
                <FcDislike />
              ) : (
                <FcQuestions />
              )}{" "}
              <strong>Status:</strong> {status}
            </Card.Text>
            <br />
            <Card.Text>
              <strong>Origin:</strong> {origin}
            </Card.Text>
            <br />
            <Card.Text>
              <strong>Episodes:</strong> {episode}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

const Search = ({ handleSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <input
        value={searchTerm}
        placeholder="Location..."
        style={{
          width: "15rem",
          backgroundColor: "#f4f9f9",
        }}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value.toLowerCase());
        }}
      />
      <Button
        variant="outline-warning"
        className="mybutton"
        onClick={() => handleSearchTerm(searchTerm, setSearchTerm)}
      >
        Search
      </Button>
    </div>
  );
};

const Clear = ({ handleClearTerm }) => {
  return (
    <div>
      <Button
        variant="outline-warning"
        className="mybutton"
        onClick={() => handleClearTerm()}
      >
        Clear
      </Button>
    </div>
  );
};

function App() {
  const [location, setLocation] = useState([]);
  let random = Math.floor(Math.random() * 108);
  const [query, setQuery] = useState(random);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    setHasData(false);
    if (query) {
      const promise = axios(
        `https://rickandmortyapi.com/api/location/${query}/`
      );

      promise.then((res) => {
        setHasData(true);
        setLocation(res.data);
      });
    }
  }, [query]);

  const handleSearch = (value, setSearchTerm) => {
    setQuery("");
    setLocation([]);
    myArrOfCharacter = [];
    characteresTemp = [];
    myLength = 0;
    setQuery(value);
    setSearchTerm("");
  };

  const handleClear = (value) => {
    setQuery("");
    setLocation([]);

    myArrOfCharacter = [];
    characteresTemp = [];
    myLength = 0;
  };

  const arrayR = [location];
  const arrayResidents = arrayR.map((value) => (
    <div key={value.id} className="hero">
      <h1
        style={{
          margin: 3,
        }}
      >
        {value.name}
      </h1>
      <p>
        <strong>Type: {value.type}</strong>
      </p>
      <p>
        <strong>Dimension: {value.dimension}</strong>
      </p>
      <p>
        <strong>
          Residents: {value.residents ? value.residents.length : "0"}
        </strong>
      </p>
    </div>
  ));

  return (
    <div className="App layout">
      <Logo />

      <div className="serchBar">
        <Search handleSearchTerm={handleSearch} />
      </div>
      <>
        <div className="gallery">{arrayResidents}</div>
        <Alert variant="warning">
          There is a total of 126 locations sorted by id.
        </Alert>{" "}
        <ResidentsContainer residents={location.residents} />
      </>
    </div>
  );
}

export default App;
