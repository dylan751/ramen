export class EmptyResponseDto {
  /**
   * Note: this property is used to avoid assigning other types to `EmptyResponseDto`
   *        e.g. without this you can have `Promise<EmptyResponseDto>` as return type
   *        but you can actually return `{foo: 'bar'}` without getting an error
   *
   *        Since the type of this property is undefined it will be omitted when serialized
   */
  __dummyProperty__?: undefined;
}
