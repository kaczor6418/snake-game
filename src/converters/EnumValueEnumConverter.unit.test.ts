import { EnumValueEnumConverter } from './EnumValueEnumConverter';
import { EnumKeyOrValueNotFound } from '../errors/EnumKeyOrValueNotFound';
import { MoveDirection } from '../core/GameController/interfaces/MoveDirection';

enum TestEnum {
  TEST_1 = 'TEST_1',
  TEST_2 = 'TEST_2'
}

describe(EnumValueEnumConverter.name, () => {
  describe(EnumValueEnumConverter.toEnumFromKey.name, () => {
    test('should convert to enum for existing enum key', () => {
      expect(EnumValueEnumConverter.toEnumFromKey(TestEnum.TEST_1, TestEnum)).toBe(TestEnum.TEST_1);
    });
    test('should throw an error for not existing enum key', () => {
      expect(() => EnumValueEnumConverter.toEnumFromKey('NOT_EXISTING', MoveDirection)).toThrowError(
        EnumKeyOrValueNotFound
      );
    });
  });
  describe(EnumValueEnumConverter.toEnumFromValue.name, () => {
    test('should convert to enum for existing enum value', () => {
      expect(EnumValueEnumConverter.toEnumFromValue(TestEnum.TEST_2, TestEnum)).toBe(TestEnum.TEST_2);
    });
    test('should throw an error for not existing enum value', () => {
      expect(() => EnumValueEnumConverter.toEnumFromValue('MoveDirection.NOT_EXISTING', MoveDirection)).toThrowError(
        EnumKeyOrValueNotFound
      );
    });
  });
});
