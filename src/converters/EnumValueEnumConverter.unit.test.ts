import 'jest';
import { EnumValueEnumConverter } from './EnumValueEnumConverter';
import { EnumKeyOrValueNotFound } from '../errors/EnumKeyOrValueNotFound';
import { MoveDirection } from '../core/GameController/interfaces/MoveDirection';

describe(EnumValueEnumConverter.name, () => {
  describe(EnumValueEnumConverter.toEnumFromKey.name, () => {
    test('should convert to enum for existing enum key', () => {
      expect(EnumValueEnumConverter.toEnumFromKey(MoveDirection.LEFT, MoveDirection)).toBe(MoveDirection.LEFT);
    });
    test('should throw an error for not existing enum key', () => {
      expect(() => EnumValueEnumConverter.toEnumFromKey('NOT_EXISTING', MoveDirection)).toThrowError(
        EnumKeyOrValueNotFound
      );
    });
  });
  describe(EnumValueEnumConverter.toEnumFromValue.name, () => {
    test('should convert to enum for existing enum value', () => {
      expect(EnumValueEnumConverter.toEnumFromValue('LEFT', MoveDirection)).toBe(MoveDirection.LEFT);
    });
    test('should throw an error for not existing enum value', () => {
      expect(() => EnumValueEnumConverter.toEnumFromValue('MoveDirection.NOT_EXISTING', MoveDirection)).toThrowError(
        EnumKeyOrValueNotFound
      );
    });
  });
});
