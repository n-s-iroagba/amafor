// models/AcademyStaff.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface for AcademyStaff attributes
export interface AcademyStaffAttributes {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials?: string;
  imageUrl?: string;
  category?: string;
  qualifications?: string[];
  yearsOfExperience?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creation attributes (optional fields for creation)
export interface AcademyStaffCreationAttributes extends Optional<AcademyStaffAttributes, 'id' | 'initials' | 'imageUrl' | 'category' | 'qualifications' | 'yearsOfExperience'> {}

class AcademyStaff extends Model<AcademyStaffAttributes, AcademyStaffCreationAttributes> implements AcademyStaffAttributes {
  public id!: string;
  public name!: string;
  public role!: string;
  public bio!: string;
  public initials?: string;
  public imageUrl?: string;
  public category?: string;
  public qualifications?: string[];
  public yearsOfExperience?: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AcademyStaff.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 150],
      },
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 2000],
      },
    },
    initials: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['coaching', 'medical', 'administrative', 'technical', 'scouting']],
      },
    },
    qualifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 60,
      },
    },
  },
  {
    sequelize,
    modelName: 'AcademyStaff',
    tableName: 'academy_staff',
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['role'],
      },
    ],
  }
);

// Hook to set initials if not provided
AcademyStaff.beforeCreate((staff) => {
  if (!staff.initials) {
    const nameParts = staff.name.split(' ');
    staff.initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }
});

export default AcademyStaff;