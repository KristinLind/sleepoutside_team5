// src/js/Alert.js
export default class Alert {
  constructor() {
  }

  async init() {
    let alerts;

    try {

      const response = await fetch('/json/alerts.json');

      if (!response.ok) {
        console.warn('Alerts file failed to load with status:', response.status);
        return;
      }

      alerts = await response.json();

      if (alerts && alerts.length > 0) {
        this.renderAlerts(alerts);
      }
    } catch (error) {
      console.error('Error loading or parsing alerts.json (Check JSON format):', error);
    }
  }

  renderAlerts(alerts) {
    const alertSection = document.createElement('section');
    alertSection.className = 'alert-list';

    alerts.forEach(alert => {
      const p = document.createElement('p');
      p.textContent = alert.message;

      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;

      alertSection.appendChild(p);
    });

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.prepend(alertSection);
    }
  }
}