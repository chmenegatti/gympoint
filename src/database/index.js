import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Subscription from '../app/models/Subscription';
import HelpOrders from '../app/models/HelpOrders';
import databaseConfig from '../config/database';

const models = [User, Students, Plans, Subscription, HelpOrders];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    );
  }
}

export default new Database();
