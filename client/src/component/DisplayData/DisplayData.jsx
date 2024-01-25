import React, { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import "./DisplayData.css";

const GET_ALL_USERS_DATA = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      nationality
      age
    }
    movies {
      id
      name
      yearOfPublication
    }
  }
`;

//make sure you write the function name with capital letter

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

// const GET_ALL_MOVIES = gql`
//   query GetAllMovies {
//     movies {
//       id
//       name
//       yearOfPublication
//     }
//   }
// `;

//note : i got the error while implementening the createuser functionality. please whatever function name used in backend's resolver function and typedefs.js file use the same variable name and type here
//createUser(userinput: createUserInput): User  so in typedefs file i useduserinput as variable name and type createUserInput.ypu can see that we use createUserInput with mutation query and while calling the createUser function we used userinput variable name.

const CREATE_USER = gql`
  mutation CreateUser($input: createUserInput) {
    createUser(userinput: $input) {
      name
      age
      nationality
    }
  }
`;

// so in this function we return a USER type in typedefs so we are using same name filed name but when we invoking a function we use the variable name as as we define in updateUserInput type.

const UPDATE_USER = gql`
  mutation UpdateUser($input: updateUserInput) {
    updateUser(userinput: $input) {
      id
      username
      nationality
      name
      age
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($deletedID: ID!) {
    deleteUser(id: $deletedID) {
      id
    }
  }
`;

const DisplayData = () => {
  const [searchvalue, setSearchValue] = useState("");
  const [ID, setID] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    age: 0,
    username: "",
    nationality: "INDIA",
  });
  const { data, error, loading, refetch } = useQuery(GET_ALL_USERS_DATA);
  // const { data: moviesData } = useQuery(GET_ALL_MOVIES);
  // if we want to fetch some data based on button click then apollo client provie one useLasyQuery hook which returns array ,the first one is function and other one is data
  const [fetchMovie, { data: movieSearchData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const updateHandler = (user) => {
    setID(user.id);
    setUserData({
      name: user.name,
      username: user.username,
      age: user.age,
      nationality: user.nationality,
    });
  };

  return (
    <div className="container">
      <div>
        <h1>Create User Form</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {ID && (
            <input
              type="number"
              id="id"
              value={ID}
              className="forminput"
              onChange={(e) => setID(e.target.value)}
            />
          )}
          <input
            type="text"
            name="name"
            id="name"
            className="forminput"
            value={userData.name}
            onChange={onChangeHandler}
          />
          <input
            type="text"
            name="username"
            id="username"
            className="forminput"
            value={userData.username}
            onChange={onChangeHandler}
          />
          <input
            type="number"
            name="age"
            id="age"
            className="forminput"
            value={userData.age}
            onChange={onChangeHandler}
          />
          <select
            className="forminput"
            value={userData.nationality}
            onChange={onChangeHandler}
            name="nationality"
            id="nationality"
          >
            <option value="INDIA">INDIA</option>
            <option value="CANADA">CANADA</option>
            <option value="GERMANY">GERMANY</option>
            <option value="BRAZIL">BRAZIL</option>
            <option value="UKRAINE">UKRAINE</option>
          </select>
          {ID !== "" ? (
            <button
              className="btn"
              onClick={() => {
                updateUser({
                  variables: {
                    input: {
                      id: Number(ID),
                      newname: userData.name,
                      newusername: userData.username,
                      newage: Number(userData.age),
                      newnationality: userData.nationality,
                    },
                  },
                });
                setUserData({
                  name: "",
                  age: 0,
                  username: "",
                  nationality: "",
                });
              }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                createUser({
                  variables: {
                    input: {
                      name: userData.name,
                      username: userData.username,
                      age: Number(userData.age),
                      nationality: userData.nationality,
                    },
                  },
                });
                setUserData({
                  name: "",
                  age: 0,
                  username: "",
                  nationality: "",
                });
              }}
            >
              Create
            </button>
          )}
        </div>
      </div>
      <h1 className="heading">Users Data</h1>
      <div className="usercards">
        {loading ? (
          <h1>Data is Loading....</h1>
        ) : (
          data &&
          data.users.map((user) => (
            <div key={user.id} className="card">
              <h1 className="name">Name: {user.name}</h1>
              <p>UserName:{user.username}</p>
              <p>Nationality: {user.nationality}</p>
              <p>age:{user.age}</p>
              <div style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
                <button onClick={() => updateHandler(user)}>Edit</button>
                <button
                  onClick={() => {
                    deleteUser({
                      variables: {
                        deletedID: user.id,
                      },
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <h1 className="heading">Movies Data</h1>
      <div className="usercards">
        {data &&
          data.movies.map((movie) => (
            <div key={movie.id} className="moviecard">
              <h1 className="name">Name: {movie.name}</h1>
              <p>yearofpublication:{movie.yearOfPublication}</p>
            </div>
          ))}
      </div>
      <div>
        <h1> Search Movie By Name using input and button</h1>
        <div className="inputcontainer">
          <input
            type="text"
            placeholder="Search movie by name"
            className="inputsearch"
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              fetchMovie({ variables: { name: searchvalue } });
            }}
          >
            Search
          </button>
        </div>
        {movieSearchData ? (
          <div>
            <p style={{ color: "blue" }}>name: {movieSearchData.movie.name}</p>
            <p style={{ color: "blue" }}>
              year: {movieSearchData.movie.yearOfPublication}
            </p>
          </div>
        ) : (
          movieError && (
            <div style={{ color: "red" }}>
              There is no data present for this movie name
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DisplayData;
