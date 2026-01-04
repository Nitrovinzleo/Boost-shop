

<main class="container">
    <div class="product-detail-container">
        <div class="product-detail-image">
            <img src="view/images/challenger.jpg" alt="Rank Boost">
        </div>

        <div class="product-detail-info">
            <h1>Boost de Rang Professionnel</h1>
            <p class="price">2.00 € / partie (+25 LP estimé)</p>
            
           <div class="calculator-box">
    <div class="input-group">
        <label>Ton Rang Actuel :</label>
        <select id="currentRank">
            <option value="0">Fer</option>
            <option value="400">Bronze</option>
            <option value="800">Argent</option>
            <option value="1200">Or</option>
            <option value="1600">Platine</option>
            <option value="2000">Émeraude</option>
            <option value="2400">Diamant</option>
        </select>
        <select id="currentDiv">
            <option value="0">Division IV</option> <option value="100">Division III</option>
            <option value="200">Division II</option>
            <option value="300">Division I</option> </select>
    </div>

    <div class="input-group">
        <label>Rang Visé :</label>
        <select id="targetRank">
            <option value="400">Bronze</option>
            <option value="800">Argent</option>
            <option value="1200">Or</option>
            <option value="1600">Platine</option>
            <option value="2000">Émeraude</option>
            <option value="2400">Diamant</option>
        
        </select>
        <select id="targetDiv">
            <option value="0" selected>Division IV</option>
            <option value="100">Division III</option>
            <option value="200">Division II</option>
            <option value="300">Division I</option>
        </select>
    </div>
    
    

                <div class="results">
                    <p>Total LP à gagner : <span id="totalLp">0</span> LP</p>
                    <p>Nombre de games : <span id="gamesNeeded">0</span></p>
                    <p class="final-price">Prix Total : <span id="totalPrice">0</span> €</p>
                </div>

                <form action="index.php?action=ajouter_au_panier" method="POST">
                    <input type="hidden" name="produit_id" value="3">
                    <input type="hidden" name="quantite" id="hiddenGames" value="0">
                    <input type="hidden" name="nom" value="Boost de Rang Professionnel">
                    <input type="hidden" name="prix" id="hiddenPrice" value="2.00">
                    <button type="submit" class="btn-add-cart">Commander ces parties</button>
                </form>
            </div>
        </div>
    </div>
</main>

<script>
    const selects = document.querySelectorAll('select');    
    function calculateBoost() {
        const currentRank = parseInt(document.getElementById('currentRank').value);
        const currentDiv  = parseInt(document.getElementById('currentDiv').value);
        const targetRank  = parseInt(document.getElementById('targetRank').value);
        const targetDiv   = parseInt(document.getElementById('targetDiv').value);

    
        const currentTotal = currentRank + currentDiv;
        const targetTotal  = targetRank + targetDiv;

        let diffLp = targetTotal - currentTotal;
        if (diffLp < 0) diffLp = 0;

        const games = Math.ceil(diffLp / 25);
        const price = games * 2;

        document.getElementById('totalLp').innerText = diffLp;
        document.getElementById('gamesNeeded').innerText = games;
        document.getElementById('totalPrice').innerText = price.toFixed(2);
        document.getElementById('hiddenGames').value = games;
        document.getElementById('hiddenPrice').value = price.toFixed(2);
    }
    


    // Écouter les changements sur tous les menus déroulants
    selects.forEach(select => {
        select.addEventListener('change', calculateBoost);
    });

    // Calcul initial au chargement
    calculateBoost();
</script>

</body>
</html>