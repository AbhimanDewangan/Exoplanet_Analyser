let chart = null;

document.getElementById("fileInput").addEventListener("change", function(e) {

    const file = e.target.files[0];

    Papa.parse(file, {
        skipEmptyLines: true,
        comments: "#",

        complete: function(res) {

            const rows = res.data;

            console.log("RAW SAMPLE:", rows.slice(0, 5));

            let times = [];
            let values = [];

            for (let r of rows) {

                if (!r || r.length < 2) continue;

                // AUTO CLEAN CONVERSION
                const t = Number(r[0]);

                // EXOTIC = usually flux in col 2 or 3
                // DMAG = usually col 1 or 2
                const v = Number(r[2] ?? r[1]);

                if (isNaN(t) || isNaN(v)) continue;

                times.push(t);
                values.push(v);
            }

            console.log("POINTS:", times.length);

            if (times.length === 0) {
                alert("File format not recognized");
                return;
            }

            const ctx = document.getElementById("chart").getContext("2d");

            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: times,
                    datasets: [{
                        label: "Light Curve",
                        data: values,
                        borderColor: "#00ffff",
                        pointRadius: 0,
                        tension: 0.2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: "Time (BJD_TDB)" } },
                        y: { title: { display: true, text: "Flux / Dmag" } }
                    }
                }
            });

        }
    });

});
