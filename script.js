// =====================
// Dynamic Links Data
// =====================

const linksData = [
  {
    short: "Linkd.sh/hKWhPa",
    url: "mywebsite.com",
    time: "7m ago",
    clicks: 27
  },
  {
    short: "Linkd.sh/iSnIPc",
    url: "mywebsite.com/blogposts",
    time: "10d ago",
    clicks: 48
  },
  {
    short: "Linkd.sh/jSnIPc",
    url: "mywebsite.com/blogposts",
    time: "10d ago",
    clicks: 48
  }
];

// =====================
// Generate Links in UI
// =====================

const container = document.getElementById("linksContainer");

fetch("http://localhost:5000/api/links")
  .then(res => res.json())
  .then(data => {
    data.forEach(link => {
      const item = document.createElement("div");
      item.classList.add("link-item");

      item.innerHTML = `
        <div class="link-info">
          <h3>${link.short}</h3>
          <p>${link.url} • ${link.time}</p>
        </div>
        <div class="click-badge">${link.clicks} clicks</div>
      `;

      container.appendChild(item);
    });
  });

// =====================
// Search Function
// =====================

const searchInput = document.querySelector(".topbar input");

searchInput.addEventListener("keyup", function () {
  const value = this.value.toLowerCase();
  const items = document.querySelectorAll(".link-item");

  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(value) ? "flex" : "none";
  });
});

// =====================
// Charts Section
// =====================

// Extract dynamic data
const clickNumbers = linksData.map(link => link.clicks);
const linkNames = linksData.map(link => link.short);


// -------- Line Chart --------

const lineCtx = document.getElementById('lineChart');

new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: linkNames,        // ✅ dynamic labels
    datasets: [{
      data: clickNumbers,     // ✅ dynamic clicks
      backgroundColor: '#6c63ff',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#222' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#222' }
      }
    }
  }
});

// -------- Bar Chart --------

const barCtx = document.getElementById('barChart');

new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: linkNames,
    datasets: [{
      data: clickNumbers,
      backgroundColor: '#6c63ff'
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#222' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#222' }
      }
    }
  }
});