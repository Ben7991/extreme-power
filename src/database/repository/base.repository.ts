export abstract class BaseRepository<Type, TypeId, PropType> {
  protected abstract selectProps(): PropType;

  abstract add(entity: Type): Promise<Type>;
  abstract update(entity: Type): Promise<Type>;
  abstract delete(entityId: TypeId): Promise<void>;
  abstract find(value: TypeId): Promise<Type | null>;
}
