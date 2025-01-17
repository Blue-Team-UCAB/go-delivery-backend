Feature: Crear productos
  Como administrador quiero agregar un producto 

  Scenario: Creando Producto Valido
    When Tratando de Crear Producto Valido
    Then Se creo el producto Correctamente

  Scenario: Creando Producto Invalido
    When Tratando de Crear Producto con Categoria no Existente
    Then No se creo el producto, categoria no valida