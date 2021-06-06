import { UTILS } from '../common/Utils/UTILS';
import { EnumKeyOrValueNotFound } from '../errors/EnumKeyOrValueNotFound';

export class EnumValueEnumConverter {
  public static toEnumFromKey<T>(key: string, enumDeclaration: Record<string, T>): T {
    const convertedEnum: T = enumDeclaration[key];
    if (UTILS.isNullOrUndefined(convertedEnum)) {
      throw new EnumKeyOrValueNotFound(`Key: **${key}** doesn't exist in this enum!`);
    }
    return convertedEnum;
  }

  public static toEnumFromValue<T>(value: string | number, enumDeclaration: Record<string, T>): T {
    const enumEntries: Array<[string, string | unknown]> = Object.entries(enumDeclaration);
    const enumSingleItem: [string, string | unknown] | undefined = enumEntries.find((enumSet) =>
      enumSet.includes(value)
    );
    if (UTILS.isNullOrUndefined(enumSingleItem)) {
      throw new EnumKeyOrValueNotFound(`Value: **${value}** doesn't exist in this enum!`);
    }
    return enumDeclaration[enumSingleItem[0]];
  }
}
