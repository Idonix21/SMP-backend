const { MissingPerson } = require("./models/models");
const { Op } = require("sequelize");

const autoApproveReports = async () => {
  try {
    // Выбираем заявки, которые были созданы более 30 минут назад и еще не одобрены или отклонены
    const timeLimit = new Date(new Date() - 90 * 60 * 1000); // 90 минут назад

    const reportsToApprove = await MissingPerson.findAll({
      where: {
        idStatus: 1, // Статус, который означает "в ожидании"
        createdAt: {
          [Op.lte]: timeLimit,
        },
      },
    });

    // Обновляем статус заявок на "одобрено"
    for (const report of reportsToApprove) {
      report.idStatus = 2; // Одобрено
      await report.save();
    }

    console.log(`Одобрено заявок: ${reportsToApprove.length}`);
  } catch (error) {
    console.error("Ошибка при автоматическом одобрении заявок:", error);
  }
};

// Запуск функции каждые 20 минут
setInterval(autoApproveReports, 20 * 60 * 1000);
