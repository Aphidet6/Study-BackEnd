export async function GET(request, { params }) {
  return Response.json({ 
    message: `Your ID is ${params.id}` 
});
}