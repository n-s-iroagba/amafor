import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface DonationAttributes {
  id: string;
  amount: number;
  currency: string;
  donorId?: string;
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  donorPhone?: string;
  message?: string;
  status: DonationStatus;
  paymentReference: string;
  paystackReference: string;
  optInSupporterWall: boolean;
  anonymous: boolean;
  metadata: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DonationCreationAttributes extends Optional<DonationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'currency' | 'status' | 'optInSupporterWall' | 'anonymous' | 'metadata'> {}

export class Donation extends Model<DonationAttributes, DonationCreationAttributes> implements DonationAttributes {
  public id!: string;
  public amount!: number;
  public currency!: string;
  public donorId?: string;
  public donorEmail!: string;
  public donorFirstName!: string;
  public donorLastName!: string;
  public donorPhone?: string;
  public message?: string;
  public status!: DonationStatus;
  public paymentReference!: string;
  public paystackReference!: string;
  public optInSupporterWall!: boolean;
  public anonymous!: boolean;
  public metadata!: Record<string, any>;
  public completedAt?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  static associate(models: any) {
    Donation.belongsTo(models.User, { foreignKey: 'donorId', as: 'donor' });
  }

  static initModel(sequelize: Sequelize): typeof Donation {
    Donation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'NGN'
        },
        donorId: {
          type: DataTypes.UUID,
          allowNull: true
        },
        donorEmail: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        donorFirstName: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        donorLastName: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        donorPhone: {
          type: DataTypes.STRING(20),
          allowNull: true
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM(...Object.values(DonationStatus)),
          allowNull: false,
          defaultValue: DonationStatus.PENDING
        },
        paymentReference: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true
        },
        paystackReference: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        optInSupporterWall: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        anonymous: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true
        } ,createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
        }
      },
      {
        sequelize,
        tableName: 'donations',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['donorEmail'] },
          { fields: ['status'] },
          { fields: ['paymentReference'], unique: true },
          { fields: ['createdAt'] },
          { fields: ['completedAt'] }
        ]
      }
    );

    return Donation;
  }
}

export default Donation;