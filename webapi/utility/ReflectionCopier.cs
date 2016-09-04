namespace fiinance.utility
{
  public static class ReflectionCopier
  {
    public static void Copy(object source, object target)
    {
      var customerType = target.GetType();
      foreach (var prop in source.GetType().GetProperties())
      {
        var propGetter = prop.GetGetMethod();
        var propSetter = customerType.GetProperty(prop.Name).GetSetMethod();
        var valueToSet = propGetter.Invoke(source, null);
        propSetter.Invoke(target, new[] { valueToSet });
      }
    }
  }
}