const home = document.getElementById("home");
const modal = new bootstrap.Modal("#Modal", {});
const buttModal = document.getElementById("buttonModal");

buttModal.onclick = async () => {

    modal.show();

}

const templateCard = `
<div class="col-md-4 mt-3">
<div class="card">
    <img src="data:image/jpeg;base64,{src}" class="card-img-top" alt="...">
    <div class="card">
                            <div class="card-body">
                                <p class="card-like">Like 0</p>
                                <p class="card-comments">Commenti 0</p>
                            </div>
                        </div>
</div>
</div>
`;

function renderPost() {

    
    
}

renderPost();
