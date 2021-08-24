var extendMultipleClasses = (baseClass, classesToBeInherited = []) => {
  classesToBeInherited.forEach((classToBeInherited) => {
    Object.getOwnPropertyNames(classToBeInherited.prototype).forEach(
      (propName) => {
        if (propName !== 'constructor') {
          Object.assign(baseClass.prototype, {
            [propName]: classToBeInherited.prototype[propName],
          });
        }
      }
    );
  });
};
