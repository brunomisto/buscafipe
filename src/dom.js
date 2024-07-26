import { getBrands, getModels, getYears, getFipe } from "./api";
import { getPreferedTheme } from "./theme";

const vehicleSearchForm = document.getElementById("search-vehicle");
const vehicleTypeSelect = document.getElementById("vehicle-type");
const vehicleBrandSelect = document.getElementById("vehicle-brand");
const vehicleModelSelect = document.getElementById("vehicle-model");
const vehicleYearSelect = document.getElementById("vehicle-year");
const vehicleSearchButton = document.getElementById("vehicle-search-button");
const vehicleOutputElement = document.getElementById("vehicle-output");
const themeTogglerButton = document.getElementById("theme-toggler");
const notificationsElement = document.getElementById("notifications");

const vehicleSelects = [
  vehicleTypeSelect,
  vehicleBrandSelect,
  vehicleModelSelect,
  vehicleYearSelect
];

const clearSelects = (index) => {
  const selectsToClear = vehicleSelects.slice(index);
  selectsToClear.forEach((select) => {
    select.innerHTML = "";
  });
};

const renderSelect = (list, select) => {
  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.innerText = "Selecione uma opção";
  defaultOption.value = "";
  select.appendChild(defaultOption);

  // list is an array with objects with "code" and "name"
  list.forEach((object) => {
    const optionElement = document.createElement("option");
    optionElement.value = object.code;
    optionElement.innerText = object.name;
    select.appendChild(optionElement);
  });
};

const renderVehicle = (fipeInfo) => {
  const vehicleElement = document.createElement("div");
  vehicleElement.className = "vehicle";

  const vehicleTopElement = document.createElement("div");
  vehicleTopElement.className = "vehicle-top";

  const vehicleModelHeading = document.createElement("h3");
  vehicleModelHeading.innerText = `${fipeInfo.model} - ${fipeInfo.modelYear}`;

  const vehicleInfoElement = document.createElement("div");
  vehicleInfoElement.className = "vehicle-info expanded";

  const vehicleControlsElement = document.createElement("div");
  vehicleControlsElement.className = "vehicle-controls";

  const vehicleExpandButton = document.createElement("button");
  vehicleExpandButton.className = "material-symbols-outlined vehicle-expand expanded";
  vehicleExpandButton.innerText = "chevron_right";
  vehicleExpandButton.addEventListener("click", () => {
    vehicleExpandButton.classList.toggle("expanded");
    vehicleInfoElement.classList.toggle("expanded");
  });

  const vehicleCloseButton = document.createElement("button");
  vehicleCloseButton.className = "material-symbols-outlined vehicle-close";
  vehicleCloseButton.innerText = "close";
  vehicleCloseButton.addEventListener("click", () => {
      vehicleElement.remove();
  });

  vehicleControlsElement.appendChild(vehicleExpandButton);
  vehicleControlsElement.appendChild(vehicleCloseButton);

  const vehicleCodeFipeElement = document.createElement("p");
  vehicleCodeFipeElement.innerText = fipeInfo.codeFipe;

  const vehicleModelYearElement = document.createElement("p");
  vehicleModelYearElement.innerText = fipeInfo.modelYear;

  const vehicleFuelElement = document.createElement("p");
  vehicleFuelElement.innerText = fipeInfo.fuel;
  
  const vehiclePriceElement = document.createElement("p");
  vehiclePriceElement.innerText = fipeInfo.price;

  const vehicleReferenceMonthElement = document.createElement("p");
  vehicleReferenceMonthElement.innerText = fipeInfo.referenceMonth;

  vehicleTopElement.appendChild(vehicleModelHeading);
  vehicleTopElement.appendChild(vehicleControlsElement);
  vehicleElement.appendChild(vehicleTopElement);
  vehicleInfoElement.appendChild(vehicleCodeFipeElement);
  vehicleInfoElement.appendChild(vehicleModelYearElement);
  vehicleInfoElement.appendChild(vehicleFuelElement);
  vehicleInfoElement.appendChild(vehiclePriceElement);
  vehicleInfoElement.appendChild(vehicleReferenceMonthElement);
  vehicleElement.appendChild(vehicleInfoElement);

  vehicleOutputElement.appendChild(vehicleElement);
};

const notificate = ({ message, type, time }) => {
  const notificationElement = document.createElement("div");
  const notificationMessageElement = document.createElement("p");
  const notificationCloseButton = document.createElement("button");

  notificationCloseButton.className = "material-symbols-outlined notification-close";
  notificationCloseButton.innerText = "close";
  notificationCloseButton.addEventListener("click", () => {
    notificationElement.remove();
  });

  notificationElement.className = `notification ${type}`;

  notificationMessageElement.innerText = `${message} ${Math.random()}`;
  notificationElement.appendChild(notificationMessageElement);
  notificationElement.appendChild(notificationCloseButton);

  // Append as the first child
  notificationsElement.insertBefore(
    notificationElement,
    notificationsElement.firstChild
  );

  setTimeout(() => {
    notificationElement.remove();
  }, time);
}

export const renderVehicleTypeSelect = () => {
  const vehicleTypes = [
    { value: "cars", text: "Carro" }, 
    { value: "motorcycles", text: "Motocicleta" }, 
    { value: "trucks", text: "Caminhão" }
  ];

  // Create and append default disabled option
  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.innerText = "Selecione o tipo de veículo";
  defaultOption.value = "";
  vehicleTypeSelect.appendChild(defaultOption);
  
  vehicleTypes.forEach((type) => {
    // Create option based on type object
    const vehicleTypeOption = document.createElement("option");
    vehicleTypeOption.value = type.value;
    vehicleTypeOption.innerText = type.text;
  
    // Append it to the select
    vehicleTypeSelect.appendChild(vehicleTypeOption);
  });
};

export const initializeTheme = () => {
  const theme = getPreferedTheme();
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeTogglerButton.innerText = "light_mode";
  } else {
    themeTogglerButton.innerText = "dark_mode";
  }
}

export const addEventListeners = () => {
  vehicleSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  vehicleTypeSelect.addEventListener("input", async () => {
    try {
      vehicleTypeSelect.disabled = true;
      const nextIndex = vehicleSelects.findIndex((select) => select === vehicleTypeSelect) + 1;
      clearSelects(nextIndex);
      const selectedType = vehicleTypeSelect.value;
      const brands = await getBrands(selectedType);
      renderSelect(brands, vehicleBrandSelect);
    } catch (error) {
      notificate({
        message: error.message,
        type: "error",
        time: 10 * 1000
      });
    } finally {
      vehicleTypeSelect.disabled = false;
    }
  });
  
  vehicleBrandSelect.addEventListener("input", async () => {
    try {
      vehicleBrandSelect.disabled = true;
      const nextIndex = vehicleSelects.findIndex((select) => select === vehicleBrandSelect) + 1;
      clearSelects(nextIndex);
      const selectedType = vehicleTypeSelect.value;
      const selectedBrand = vehicleBrandSelect.value;
      const models = await getModels(selectedType, selectedBrand);
      renderSelect(models, vehicleModelSelect);
    } catch (error) {
      notificate({
        message: error.message,
        type: "error",
        time: 10 * 1000
      });
    } finally {
      vehicleBrandSelect.disabled = false;
    }
  });

  vehicleModelSelect.addEventListener("input", async () => {
    try {
      vehicleModelSelect.disabled = true;
      const nextIndex = vehicleSelects.findIndex((select) => select === vehicleModelSelect) + 1;
      clearSelects(nextIndex);
      const selectedType = vehicleTypeSelect.value;
      const selectedBrand = vehicleBrandSelect.value;
      const selectedModel = vehicleModelSelect.value;
      const years = await getYears(selectedType, selectedBrand, selectedModel);
      renderSelect(years, vehicleYearSelect);
    } catch (error) {
      notificate({
        message: error.message,
        type: "error",
        time: 10 * 1000
      });
    } finally {
      vehicleModelSelect.disabled = false;
    }
  });

  vehicleSearchButton.addEventListener("click", async () => {
    const selectedType = vehicleTypeSelect.value;
    const selectedBrand = vehicleBrandSelect.value;
    const selectedModel = vehicleModelSelect.value;
    const selectedYear = vehicleYearSelect.value;

    const isAllSelected = selectedType && selectedBrand && selectedModel && selectedYear;
    if (!isAllSelected) {
      return notificate({
        message: "Selecione todas as opções",
        type: "error",
        time: 10 * 1000
      });
    }

    try {
      vehicleSearchButton.disabled = true;
      const fipeInfo = await getFipe(selectedType, selectedBrand, selectedModel, selectedYear);
      renderVehicle(fipeInfo);
    } catch(error) {
      notificate({
        message: error.message,
        type: "error",
        time: 10 * 1000
      });
    } finally {
      vehicleSearchButton.disabled = false;
    }
  });

  themeTogglerButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    // Check selected theme and save it to localStorage
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (isDark) {
      themeTogglerButton.innerText = "light_mode";
    } else {
      themeTogglerButton.innerText = "dark_mode";
    }
  });
};
