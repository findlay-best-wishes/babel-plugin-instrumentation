// import { addDefault } from '@babel/helper-module-imports'
const { addDefault } = require('@babel/helper-module-imports')

const plugin = ({template}) => {
  return {
    visitor: {
      Program: {
        enter(path, state) {

          path.traverse({
            ImportDeclaration(curPath) {
              const soureValue = curPath.get('source').node.value
              if (soureValue === 'my-tracker') {
                const specifier = curPath.get('specifier.0')
                // state中存放模块内使用的名称
                // if (specifier.isImportDefault) {
                //   state.trackerImportId = 
                // }
                // if (specifier.isImportNamespaceSpecifier) {
                //   state.trackerImportId = 
                // }
                if (specifier.isImportDefault() || specifier.isImportNamespaceSpecifier()) {
                  state.trackerImportId = specifier.get('local').node.name
                }
                path.stop()
              }
            }
          })

          if (!state.trackerImportId) {
            const trackerImportId = addDefault(path, 'my-tracker', {
              nameHint: path.scope.generateUid('tracker')
            }).name
            state.trackerImportId = trackerImportId
          }

        }
      },

      "FunctionDeclaration|ClassMethod|ArrowFunctionExpression|FunctionExpression"(path, state) {
        const bodyPath = path.get('body')
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(
            template.statement(`${state.trackerImportId}()`)()
          )
        } else {
          const newBody = template.statement(`{${state.trackerImportId}()\nreturn PREV_BODY}`)({
            PREV_BODY: bodyPath.node
          })
          bodyPath.replaceWith(newBody)
        }
      }
    } 
  }
}

// export default plugin
module.exports = plugin