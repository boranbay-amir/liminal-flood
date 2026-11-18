const rolesList = document.querySelector("#roles-list");
const searchInput = document.querySelector("#role-search");
const filterSelect = document.querySelector("#role-filter");
const roleCount = document.querySelector("#role-count");
const roles = Array.isArray(window.liminalRoles) ? window.liminalRoles : [];

function cleanUsername(value) {
  return String(value || "").trim().replace(/^@/, "");
}

function renderRoles() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;
  const filteredRoles = roles.filter(role => {
    const username = cleanUsername(role.user);
    const isTaken = username.length > 0;
    const matchesQuery = [role.name, role.fandom, username]
      .some(value => String(value || "").toLowerCase().includes(query));
    const matchesFilter = filter === "all" || (filter === "taken" && isTaken) || (filter === "free" && !isTaken);
    return matchesQuery && matchesFilter;
  });

  rolesList.replaceChildren();
  roleCount.textContent = String(filteredRoles.length);

  if (filteredRoles.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = roles.length === 0 ? "Список ролей пока пуст." : "По этому запросу ничего не найдено.";
    rolesList.append(empty);
    return;
  }

  filteredRoles.forEach(role => {
    const username = cleanUsername(role.user);
    const isTaken = username.length > 0;
    const card = document.createElement("article");
    card.className = "role-card";

    const name = document.createElement("h3");
    name.textContent = role.name || "Без имени";

    const fandom = document.createElement("p");
    fandom.className = "role-fandom";
    fandom.textContent = role.fandom || "Фандом не указан";

    const bottom = document.createElement("div");
    bottom.className = "role-bottom";

    const status = document.createElement("span");
    status.className = isTaken ? "role-status taken" : "role-status";
    status.textContent = isTaken ? "Занята" : "Свободна";
    bottom.append(status);

    if (isTaken) {
      const owner = document.createElement("a");
      owner.className = "role-owner";
      owner.href = `https://t.me/${encodeURIComponent(username)}`;
      owner.target = "_blank";
      owner.rel = "noopener noreferrer";
      owner.textContent = `@${username}`;
      owner.setAttribute("aria-label", `Открыть Telegram пользователя ${username}`);
      bottom.append(owner);
    }

    card.append(name, fandom, bottom);
    rolesList.append(card);
  });
}

searchInput.addEventListener("input", renderRoles);
filterSelect.addEventListener("change", renderRoles);
renderRoles();
