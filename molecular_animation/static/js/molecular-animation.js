document.getElementById('update-viewer').addEventListener('click', function() {
    const hydrogenRadius = parseFloat(document.getElementById('hydrogen-radius').value);
    render3DMolecule('h2o', hydrogenRadius);
});

function render3DMolecule(moleculeName, hydrogenRadius) {
    const container = document.getElementById('mol3d-container');
    container.innerHTML = '<div id="viewer" style="width:100%; height:100%; position:relative;"></div>';

    setTimeout(() => {
        let element = $('#viewer');

        viewer = $3Dmol.createViewer(element, {
            backgroundColor: 'white',
            antialias: true
        });

        let model = viewer.addModel(moleculeStructures[moleculeName].pdb, "pdb");

        viewer.setStyle({}, {
            stick: { radius: 0.3, color: "#666666" },
            sphere: { radius: 0.8 }
        });

        viewer.addStyle({atom: "H"}, {
            sphere: { radius: hydrogenRadius, color: "#ffffff" }
        });

        viewer.zoomTo();
        viewer.render();
    }, 100);
}

const moleculeStructures = {
    h2o: `
        HEADER    WATER
        HETATM    1  O   HOH A   1      0.000   0.000   0.000
        HETATM    2  H1  HOH A   1      0.957   0.000   0.000
        HETATM    3  H2  HOH A   1     -0.239   0.927   0.000
        END
    `
};

const atomColors = {
    H: "#ffffff"
};
