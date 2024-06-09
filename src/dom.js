import { getBrands, getModels, getYears, getFipe } from "./api";

const vehicleSearchForm = document.getElementById("search-vehicle");
const vehicleTypeSelect = document.getElementById("vehicle-type");
const vehicleBrandSelect = document.getElementById("vehicle-brand");
const vehicleModelSelect = document.getElementById("vehicle-model");
const vehicleYearSelect = document.getElementById("vehicle-year");
const vehicleSearchButton = document.getElementById("vehicle-search-button");
const vehicleOutputElement = document.getElementById("vehicle-output");

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

  const vehicleModelHeading = document.createElement("h3");
  vehicleModelHeading.innerText = fipeInfo.model;

  const vehicleCloseButton = document.createElement("button");
  vehicleCloseButton.innerText = "close";
  vehicleCloseButton.addEventListener("click", () => {
    if (prompt("are you sure?")) {
      vehicleElement.remove();
    }
  });

  const vehicleModelYearElement = document.createElement("p");
  vehicleModelYearElement.innerText = fipeInfo.modelYear;

  const vehicleFuelElement = document.createElement("p");
  vehicleFuelElement.innerText = fipeInfo.fuel;
  
  const vehiclePriceElement = document.createElement("p");
  vehiclePriceElement.innerText = fipeInfo.price;

  const vehicleReferenceMonthElement = document.createElement("p");
  vehicleReferenceMonthElement.innerText = fipeInfo.referenceMonth;

  vehicleElement.appendChild(vehicleModelHeading);
  vehicleElement.appendChild(vehicleCloseButton);
  vehicleElement.appendChild(vehicleModelYearElement);
  vehicleElement.appendChild(vehicleFuelElement);
  vehicleElement.appendChild(vehiclePriceElement);
  vehicleElement.appendChild(vehicleReferenceMonthElement);

  vehicleOutputElement.appendChild(vehicleElement);
};

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
      alert(error.message);
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
      alert(error.message);
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
      alert(error.message);
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
      return alert("Selecione todas as opções");
    }

    try {
      vehicleSearchButton.disabled = true;
      const fipeInfo = await getFipe(selectedType, selectedBrand, selectedModel, selectedYear);
      renderVehicle(fipeInfo);
    } catch(error) {
      alert(error.message);
    } finally {
      vehicleSearchButton.disabled = false;
    }
  });
};
