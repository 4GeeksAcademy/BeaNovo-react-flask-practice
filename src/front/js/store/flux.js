// import { jwtDecode } from "jwt-decode";
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false,
			user: null,
			logged: false,
			token:null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			signup: async (email, password) => {
				const raw = JSON.stringify({
				  email: email,
				  password: password
				});
			  
				const requestOptions = {
				  method: "POST",
				  headers: {"Content-Type": "application/json"},
				  body: raw,
				};
			  
				try {
				  const response = await fetch("https://reimagined-adventure-v6p4pp7rxgwvfwvwg-3001.app.github.dev/api/signup", requestOptions);
				  
				  if (response.status === 201) {
					const data = await response.json();
					
				
					const loginSuccess = await getActions().login(email, password);
					return loginSuccess;
				  } else {
					const errorData = await response.json();
					console.error("Error en registro:", errorData.msg);
					alert(errorData.msg || "Error en registro"); 
					return false;
				  }
				} catch (error) {
				  console.error("Error de red:", error);
				  alert("Error de conexión");
				  return false;
				}
			  },



			login: async (email, password) => {
				const raw = JSON.stringify({
				  "email": email,
				  "password": password
				});
			  
				const requestOptions = {
				  method: "POST",
				  headers: {"Content-Type": "application/json"},
				  body: raw,
				};
			  
				try {
				  const response = await fetch("https://reimagined-adventure-v6p4pp7rxgwvfwvwg-3001.app.github.dev/api/login", requestOptions);
				  
				  if (response.status === 200) {
					const data = await response.json();
					localStorage.setItem("token", data.token);
					setStore({ 
					  logged: true,
					  user: { id: data.user_id, email: data.email }, 
					  token: data.token,
					  auth: true
					});
					return true;
				  }
				  return false; 
				} catch (error) {
				  console.error(error);
				  return false;
				}
			  },
			getPrivate: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch("https://reimagined-adventure-v6p4pp7rxgwvfwvwg-3001.app.github.dev/api/login", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					const result = await response.json();
					setStore({ user: result.logged_in_as })

				} catch (error) {
					console.error(error);
				};
			},
			verifyToken: async () => {
				const token = localStorage.getItem("token");
				if (!token) return false;
			  
				try {
				  const response = await fetch("https://reimagined-adventure-v6p4pp7rxgwvfwvwg-3001.app.github.dev/api/verify-token", {
					method: "GET",
					headers: {
					  "Authorization": `Bearer ${token}`
					},
				  });
				  
				  if (response.ok) {
					const data = await response.json();
					setStore({ 
					  auth: data.valid,
					  logged: data.valid,
					  user: data.user, 
					  token: token
					});
					return data.valid;
				  }
				  return false;
				} catch (error) {
				  console.error("Error verifying token:", error);
				  return false;
				}
			  },
			logout: () => {
				
		
					localStorage.removeItem("token");
					setStore({ 
						token: null,
						user: null,
						auth: false,
						logged: false
					});
					// navigate("/")
				}
				,
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;