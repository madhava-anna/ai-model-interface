import { Resend } from "resend";


export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    async function handleRequest(request) {
      
		const resend = new Resend(env.API_KEY);
		console.log("Request: "+request);   
		const req = await request.json();
    let response;
		fetch("https://api.cloudflare.com/client/v4/accounts/65bdc6858b8bb12769049814c5ae57d6/ai/run/@cf/google/gemma-3-12b-it",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+env.API_KEY,
        },
        method: "POST",
        body: JSON.stringify(json_msg)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        response = new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        }); 
        
    })
    .catch(function(res){ console.log(res) })

      // Set CORS headers
	  const url = new URL(request.url);	
      response.headers.set("Access-Control-Allow-Origin", "*");

      // Append to/Add Vary header so browser will cache response correctly
      response.headers.append("Vary", "Origin");

      return response;
    }

    async function handleOptions(request) {
      if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
      ) {
        // Handle CORS preflight requests.
        return new Response(null, {
          headers: {
            ...corsHeaders,
            "Access-Control-Allow-Headers": request.headers.get(
              "Access-Control-Request-Headers",
            ),
          },
        });
      } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: "GET, HEAD, POST, OPTIONS",
          },
        });
      }
    }

    const url = new URL(request.url);
      if (request.method === "OPTIONS") {
        // Handle CORS preflight requests
        return handleOptions(request);
      } else if (
        request.method === "GET" ||
        request.method === "HEAD" ||
        request.method === "POST"
      ) {
        // Handle requests to the API server
        return handleRequest(request);
      } else {
        return new Response(null, {
          status: 405,
          statusText: "Method Not Allowed",
        });
      }
    
  },
};
